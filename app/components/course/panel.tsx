import { PanelValue } from "@/app/components/course/util"

type PanelProps = {
    value: PanelValue;
    onClick: () => void;
}

// Panelを表すコンポーネント
export const Panel = ({ value, onClick }: PanelProps) => {
    const panelStyle = `flex justify-center items-center w-10 h-10 border border-gray-800`
    const routeStyle = `${value === "start" ? "bg-red-500" : value === "goal" ? "bg-green-400" : "bg-blue-400"} `
    const hasRole = value === "start" || value === "goal" || value === "route"

    return (
        <div
            onClick={onClick}
            className={`${panelStyle} bg-white`}
            style={{ width: "50px", height: "50px" }}
        >
        {hasRole && <div className={routeStyle} style={{ width: "40px", height: "40px" }}>{value}</div>}
        </div>
    )
}