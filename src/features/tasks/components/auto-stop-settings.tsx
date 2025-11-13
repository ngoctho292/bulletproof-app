'use client';

import { useState } from 'react';

interface AutoStopSettingsProps {
  enabled: boolean;
  thresholdPercent: number;
  checkIntervalMinutes: number;
  onSettingsChange: (settings: {
    enabled: boolean;
    thresholdPercent: number;
    checkIntervalMinutes: number;
  }) => void;
}

export const AutoStopSettings = ({
  enabled,
  thresholdPercent,
  checkIntervalMinutes,
  onSettingsChange,
}: AutoStopSettingsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localThreshold, setLocalThreshold] = useState(thresholdPercent);
  const [localInterval, setLocalInterval] = useState(checkIntervalMinutes);

  const handleEnabledChange = (checked: boolean) => {
    onSettingsChange({
      enabled: checked,
      thresholdPercent: localThreshold,
      checkIntervalMinutes: localInterval,
    });
  };

  const handleThresholdChange = (value: number) => {
    setLocalThreshold(value);
    if (enabled) {
      onSettingsChange({
        enabled,
        thresholdPercent: value,
        checkIntervalMinutes: localInterval,
      });
    }
  };

  const handleIntervalChange = (value: number) => {
    setLocalInterval(value);
    if (enabled) {
      onSettingsChange({
        enabled,
        thresholdPercent: localThreshold,
        checkIntervalMinutes: value,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleEnabledChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              🤖 Tự động dừng task
              {enabled && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Đang hoạt động
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500">
              Kiểm tra tất cả tasks đang chạy mỗi {checkIntervalMinutes} phút
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Xem cài đặt chi tiết"
        >
          <svg
            className={`w-5 h-5 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-3 border-t border-gray-200">
          {/* Threshold Percent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngưỡng dừng (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={localThreshold}
                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <input
                type="number"
                min="50"
                max="100"
                value={localThreshold}
                onChange={(e) => handleThresholdChange(Number(e.target.value))}
                className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <span className="text-sm font-medium text-gray-700">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Task sẽ tự động dừng khi đạt {localThreshold}% thời gian ước tính
            </p>
          </div>

          {/* Check Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tần suất kiểm tra (phút)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={localInterval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <input
                type="number"
                min="1"
                max="10"
                value={localInterval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <span className="text-sm font-medium text-gray-700">phút</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Hệ thống sẽ kiểm tra các task mỗi {localInterval} phút
            </p>
          </div>

          {/* Warnings */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-yellow-800 mb-2">
              ⚠️ Lưu ý:
            </p>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>Chỉ hoạt động khi tab active:</strong> Browser throttle
                  setInterval khi tab ẩn
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>Cần planned_duration_time {'>'} 0:</strong> Tasks không có
                  thời gian ước tính sẽ không được auto-stop
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>Phụ thuộc kết nối mạng:</strong> Nếu mất mạng sẽ không
                  dừng được
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">•</span>
                <span>
                  <strong>Kiểm tra định kỳ:</strong> Không phải realtime, tasks sẽ
                  được kiểm tra theo tần suất cấu hình
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
