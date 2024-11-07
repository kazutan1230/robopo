"use client"
import { useEffect, useState } from "react"

type ThreeTabsProps = {
  tab1Title: string
  tab1: JSX.Element
  tab2Title: string
  tab2: JSX.Element
  tab3Title: string
  tab3: JSX.Element
}

export const ThreeTabs = ({ tab1Title, tab1, tab2Title, tab2, tab3Title, tab3 }: ThreeTabsProps) => {
  const [threeCols, setThreeCols] = useState(false)
  useEffect(() => {
    // 768px以上のブレイクポイントに対応
    const mediaQuery768 = window.matchMedia("(min-width: 768px)")

    const updateItemsPerPage = () => {
      if (mediaQuery768.matches) {
        setThreeCols(true) // 768px以上では3行
      } else {
        setThreeCols(false) // 768px未満では1行
      }
    }

    // イベントリスナーの定義
    const handleMediaChange = () => {
      updateItemsPerPage()
    }

    // 各メディアクエリにリスナーを登録
    mediaQuery768.addEventListener("change", handleMediaChange)

    // 初期化時に適切な itemsPerPage を設定
    updateItemsPerPage()

    // クリーンアップ
    return () => {
      mediaQuery768.removeEventListener("change", handleMediaChange)
    }
  }, [])

  return (
    <>
      {/* 768px以上の場合は3行で表示 */}
      {threeCols && (
        <div className="flex flex-row justify-center w-full m-5">
          <div className="w-1/3">
            <h1 className="text-2xl m-3">{tab1Title}</h1>
            {tab1}
          </div>
          <div className="w-1/3">
            <h1 className="text-2xl m-3">{tab2Title}</h1>
            {tab2}
          </div>
          <div className="w-1/3">
            <h1 className="text-2xl m-3">{tab3Title}</h1>
            {tab3}
          </div>
        </div>
      )}

      {/* 768px未満の場合は1行で表示 */}
      {!threeCols && (
        <div role="tablist" className="tabs tabs-lifted m-5">
          <input
            type="radio"
            name="tabs"
            role="tab"
            className="tab whitespace-nowrap"
            aria-label={tab1Title}
            defaultChecked
          />
          <div role="tabpanel" className="tab-content bg-base-100 border border-base-300 rounded-box p-6">
            {tab1}
          </div>
          <input type="radio" name="tabs" role="tab" className="tab whitespace-nowrap" aria-label={tab2Title} />
          <div role="tabpanel" className="tab-content bg-base-100 border border-base-300 rounded-box p-6">
            {tab2}
          </div>
          <input type="radio" name="tabs" role="tab" className="tab whitespace-nowrap" aria-label={tab3Title} />
          <div role="tabpanel" className="tab-content bg-base-100 border border-base-300 rounded-box p-6">
            {tab3}
          </div>
        </div>
      )}
    </>
  )
}
