use tauri::{State, Manager};
use crate::config::{AppState, save_config};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct WindowSizeUpdate {
    pub width: f64,
    pub height: f64,
    pub fixed: bool,
}

#[tauri::command]
pub async fn apply_window_constraints(state: State<'_, AppState>, app: tauri::AppHandle) -> Result<(), String> {
    let window_config = {
        let config = state.config.lock().map_err(|e| format!("获取配置失败: {}", e))?;
        config.window_config.clone()
    };

    if let Some(window) = app.get_webview_window("main") {
        // 设置窗口约束
        if let Err(e) = window.set_min_size(Some(tauri::LogicalSize::new(
            window_config.min_width,
            window_config.min_height,
        ))) {
            return Err(format!("设置最小窗口大小失败: {}", e));
        }

        if let Err(e) = window.set_max_size(Some(tauri::LogicalSize::new(
            window_config.max_width,
            window_config.max_height,
        ))) {
            return Err(format!("设置最大窗口大小失败: {}", e));
        }

        // 如果启用了自动调整大小，设置为合适的初始大小
        if window_config.auto_resize {
            let initial_width = window_config.min_width;
            let initial_height = (window_config.min_height + window_config.max_height) / 2.0;
            
            if let Err(e) = window.set_size(tauri::LogicalSize::new(initial_width, initial_height)) {
                return Err(format!("设置窗口大小失败: {}", e));
            }
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn update_window_size(size_update: WindowSizeUpdate, state: State<'_, AppState>, app: tauri::AppHandle) -> Result<(), String> {
    // 更新配置
    {
        let mut config = state.config.lock().map_err(|e| format!("获取配置失败: {}", e))?;

        if size_update.fixed {
            // 固定模式：设置最大和最小尺寸为相同值
            config.window_config.max_width = size_update.width;
            config.window_config.max_height = size_update.height;
            config.window_config.min_width = size_update.width;
            config.window_config.min_height = size_update.height;
            config.window_config.auto_resize = false;
        } else {
            // 自由拉伸模式：设置合理的最小值和较大的最大值
            config.window_config.min_width = 400.0;
            config.window_config.min_height = 400.0;
            config.window_config.max_width = 2000.0;
            config.window_config.max_height = 1500.0;
            config.window_config.auto_resize = true;
        }
    }

    // 保存配置
    save_config(&state, &app).await.map_err(|e| format!("保存配置失败: {}", e))?;

    // 应用到当前窗口
    if let Some(window) = app.get_webview_window("main") {
        if size_update.fixed {
            // 固定模式：设置精确的窗口大小和约束
            if let Err(e) = window.set_size(tauri::LogicalSize::new(size_update.width, size_update.height)) {
                return Err(format!("设置窗口大小失败: {}", e));
            }

            if let Err(e) = window.set_min_size(Some(tauri::LogicalSize::new(size_update.width, size_update.height))) {
                return Err(format!("设置最小窗口大小失败: {}", e));
            }

            if let Err(e) = window.set_max_size(Some(tauri::LogicalSize::new(size_update.width, size_update.height))) {
                return Err(format!("设置最大窗口大小失败: {}", e));
            }

            println!("✅ 窗口已设置为固定大小: {}x{}", size_update.width, size_update.height);
        } else {
            // 自由拉伸模式：设置合理的约束范围
            if let Err(e) = window.set_min_size(Some(tauri::LogicalSize::new(400.0, 400.0))) {
                return Err(format!("设置最小窗口大小失败: {}", e));
            }

            if let Err(e) = window.set_max_size(Some(tauri::LogicalSize::new(2000.0, 1500.0))) {
                return Err(format!("设置最大窗口大小失败: {}", e));
            }

            // 设置为默认大小
            if let Err(e) = window.set_size(tauri::LogicalSize::new(size_update.width, size_update.height)) {
                return Err(format!("设置窗口大小失败: {}", e));
            }

            println!("✅ 窗口已设置为自由拉伸模式，默认大小: {}x{}", size_update.width, size_update.height);
        }
    }

    Ok(())
}
