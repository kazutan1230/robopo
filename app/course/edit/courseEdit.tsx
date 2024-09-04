import { useState } from "react"
import { FieldState, PanelValue, putPanel } from "@/app/components/course/util"
import { SelectPanel } from "@/app/components/course/selectPanel"
import { Field } from "@/app/components/course/field"

type CourseEditProps = {
  field: FieldState
  setField: React.Dispatch<React.SetStateAction<FieldState>>
}
export default function CourseEdit({ field, setField }: CourseEditProps) {
  const [mode, setMode] = useState<PanelValue>(null)

  const handlePanelClick = (row: number, col: number) => {
    // panelが置けるかどうかをチェック
    const newField = putPanel(field, row, col, mode)
    // panelを置けた場合
    if (newField) {
      setField(newField)
    }
    // console.log("field" + field)
    // console.log("newfield" + newField)
  }

  return (
    <>
      <p>CourseEdit</p>
      <p>{mode === "start" ? "Start" : mode === "goal" ? "Goal" : mode === "route" ? "Route" : "null"}</p>
      <div className="container mx-auto p-4">
        <div className="card bg-base-100 w-full shadow-xl">
          <div className="card-body">
            <Field field={field} onPanelClick={handlePanelClick} />
          </div>
        </div>
        <div className="card bg-base-100 w-full shadow-xl">
          <div className="card-body">
            <SelectPanel field={field} setmode={setMode} />
          </div>
        </div>
      </div>
    </>
  )
}
