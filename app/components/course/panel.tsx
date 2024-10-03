import { PanelValue, PANEL_WIDTH, PANEL_HEIGHT } from "@/app/components/course/utils"

type PanelProps = {
  value: PanelValue
  onClick: () => void
}

// Panelを表すコンポーネント
export const Panel = ({ value, onClick }: PanelProps) => {
  const panelStyle = `flex justify-center items-center w-10 h-10 border border-gray-800`
  const routeStyle = `${value === "start" ? "bg-pink-300" : value === "goal" ? "bg-green-300" : "bg-blue-300"} `
  const hasRole = value === "start" || value === "goal" || value === "route"

  return (
    <div
      onClick={onClick}
      className={`${panelStyle} bg-white`}
      style={{ width: `${PANEL_WIDTH}` + "px", height: `${PANEL_HEIGHT}` + "px" }}>
      {hasRole && (
        <div
          className={routeStyle + " flex justify-center items-center font-bold rounded text-lg"}
          style={{ width: `${PANEL_WIDTH - 10}` + "px", height: `${PANEL_HEIGHT - 10}` + "px" }}>
          {value}
        </div>
      )}
    </div>
  )
}
