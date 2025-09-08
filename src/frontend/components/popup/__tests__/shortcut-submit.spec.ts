import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, computed } from 'vue'
import McpPopup from '../McpPopup.vue'
import type { McpResponse } from '../../../types/popup'

// 1) Mock Tauri invoke，拦截发送的响应
let capturedResponse: McpResponse | null = null
vi.mock('@tauri-apps/api/core', () => {
  return {
    invoke: vi.fn(async (cmd: string, args?: any) => {
      switch (cmd) {
        case 'get_shortcut_config':
          // 返回一个最小的快捷键配置，用不到细节
          return {
            shortcuts: {
              quick_submit: {
                id: 'quick_submit',
                name: '快速发送',
                description: '测试用',
                action: 'submit',
                key_combination: { key: 'Enter', ctrl: true, alt: false, shift: false, meta: false },
                enabled: true,
                scope: 'popup',
              },
            },
          }
        case 'get_reply_config':
          return { enable_continue_reply: true, continue_prompt: '请按照最佳实践继续' }
        case 'get_custom_prompt_config':
          return { prompts: [], enabled: true, maxPrompts: 16 }
        case 'send_mcp_response':
          capturedResponse = args.response
          return null
        case 'exit_app':
          return null
        default:
          return null
      }
    }),
  }
})

// 1.1) Mock Tauri event.listen，避免真实事件绑定
vi.mock('@tauri-apps/api/event', () => {
  return {
    listen: vi.fn(async () => {
      return () => {}
    }),
  }
})

// 1.2) Mock naive-ui 的 useMessage，避免依赖 NMessageProvider
vi.mock('naive-ui', async (orig) => {
  return {
    ...(await (orig() as any)),
    useMessage: () => ({
      success: vi.fn(),
      warning: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    }),
  }
})

// 2) Stub 子组件：PopupInput
// 暴露 forceSync 和 getCurrentData，模拟“子组件里有但父组件未同步”的最新快照
const PopupInputStub = defineComponent({
  name: 'PopupInput',
  setup(_, { expose }) {
    const forceSync = vi.fn(async () => {})
    const getCurrentData = () => ({
      userInput: '来自快捷键的最新输入',
      selectedOptions: ['选项A'],
      draggedImages: [],
    })
    // 与真实组件保持相同的对外API，避免父组件访问失败
    expose({
      forceSync,
      getCurrentData,
      canSubmit: computed(() => true),
      statusText: computed(() => ''),
      updateData: vi.fn(),
      handleQuoteMessage: vi.fn(),
    })
    return () => h('div', 'PopupInputStub')
  },
})

// 3) Stub 子组件：PopupActions
// 仅用于触发 submit 事件，避免依赖真实快捷键与 Naive UI
const PopupActionsStub = defineComponent({
  name: 'PopupActions',
  emits: ['submit', 'continue', 'enhance'],
  setup(_, { emit }) {
    return () => h('button', { onClick: () => emit('submit') }, 'SubmitStub')
  },
})

// 4) Stub 子组件：PopupContent（与测试无关）
const PopupContentStub = defineComponent({ name: 'PopupContent', setup: () => () => h('div', 'ContentStub') })

describe('McpPopup 快捷键提交 - 使用子组件最新快照', () => {
  it('接收到提交事件时，使用 PopupInput.getCurrentData 的最新内容与选项', async () => {
    capturedResponse = null

    const wrapper = mount(McpPopup, {
      props: {
        request: {
          id: 'req-1',
          message: '请选择并补充说明',
          predefined_options: ['选项A', '选项B'],
          is_markdown: false,
        },
        appConfig: {
          theme: 'dark',
          window: { alwaysOnTop: false, width: 800, height: 600, fixed: false },
          audio: { enabled: false, url: '' },
          reply: { enabled: true, prompt: '请按照最佳实践继续' },
        },
        mockMode: false,
      },
      global: {
        // 用 stub 替换重组件，避免引入 Naive UI 与快捷键实现细节
        stubs: {
          PopupInput: PopupInputStub,
          PopupActions: PopupActionsStub,
          PopupContent: PopupContentStub,
        },
      },
    })

    // 通过触发 PopupActions 的 submit 事件，模拟快捷键/按钮发起的提交流程
    await wrapper.findComponent(PopupActionsStub).trigger('click')
    await flushPromises()

    // 断言：父组件构建的响应包含子组件最新快照
    expect(capturedResponse).toBeTruthy()
    expect(capturedResponse?.user_input).toBe('来自快捷键的最新输入')
    expect(capturedResponse?.selected_options).toEqual(['选项A'])
    expect(Array.isArray(capturedResponse?.images)).toBe(true)
  })
})
