import { useState, useEffect, useCallback } from 'react'

// 检测是否在 Electron 环境中
const isElectron = typeof window !== 'undefined' && window.electronAPI

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue)
  const [loaded, setLoaded] = useState(false)

  // 初始化时加载数据
  useEffect(() => {
    async function load() {
      if (isElectron) {
        // Electron: 从文件加载
        try {
          const data = await window.electronAPI.loadData()
          if (data && data[key] !== undefined) {
            setStoredValue(data[key])
          }
        } catch (e) {
          console.error('Electron load error:', e)
        }
      } else {
        // 浏览器: 从 localStorage 加载
        try {
          const item = window.localStorage.getItem(key)
          if (item) setStoredValue(JSON.parse(item))
        } catch (e) {
          console.error('localStorage read error:', e)
        }
      }
      setLoaded(true)
    }
    load()
  }, [key])

  // 数据变化时保存
  useEffect(() => {
    if (!loaded) return

    if (isElectron) {
      // Electron: 保存到文件
      async function save() {
        try {
          const data = await window.electronAPI.loadData() || {}
          data[key] = storedValue
          await window.electronAPI.saveData(data)
        } catch (e) {
          console.error('Electron save error:', e)
        }
      }
      save()
    } else {
      // 浏览器: 保存到 localStorage
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue))
      } catch (e) {
        console.error('localStorage write error:', e)
      }
    }
  }, [key, storedValue, loaded])

  return [storedValue, setStoredValue]
}
