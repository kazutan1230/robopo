import { getPanelWidth, getPanelHeight, PanelValue, PanelString } from "@/app/components/course/utils"

type PanelProps = {
  value: PanelValue
  type?: string
  onClick: () => void
}

// Panelを表すコンポーネント
export const Panel = ({ value, type, onClick }: PanelProps) => {
  const panelStyle = `flex justify-center items-center w-10 h-10 border border-gray-800`
  const routeStyle = `${value === "start" ? "bg-pink-300" : value === "goal" ? "bg-green-300" : "bg-blue-300"} `
  const hasRole = value === "start" || value === "goal" || value === "route"

  const panelWidth = getPanelWidth(type)
  const panelHeight = getPanelHeight(type)

  return (
    <div
      onClick={onClick}
      className={`${panelStyle} bg-white`}
      style={{ width: `${panelWidth}` + "px", height: `${panelHeight}` + "px" }}>
      {hasRole && (
        <div
          className={routeStyle + " flex justify-center items-center font-bold rounded text-lg"}
          style={{ width: `${panelWidth - 10}` + "px", height: `${panelWidth - 10}` + "px" }}>
          {type === "ipponBashi" ? "" : PanelString[value]}
        </div>
      )}
    </div>
  )
}
