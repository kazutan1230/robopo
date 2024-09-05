// コース作成の最大サイズ
export const MAX_FIELD_WIDTH: number = 5
export const MAX_FIELD_HEIGHT: number = 5

// Panelの種類
export type PanelValue = "start" | "goal" | "route" | null
export type FieldState = PanelValue[][]

// Missionの種類 u:up上向き r:right右向き d:down下向き l:left左向き
// mf:move_forward前進 mb:move_backward後退 tr:turn_right右転 tl:turn_left左転
export type MissionValue = "u" | "r" | "d" | "l" | "mf" | "mb" | "tr" | "tl" | "" | number | null
export const MissionString: { [key in Exclude<MissionValue, null>]: string | null } = {
  u: "上向き",
  r: "右向き",
  d: "下向き",
  l: "左向き",
  mf: "前進",
  mb: "後進",
  tr: "右回転",
  tl: "左回転",
  "": "空",
}

export type MissionState = MissionValue[]

// Point
export type PointValue = number | null
export type PointState = PointValue[]

// 初期配置を表示する関数。ゆくゆくは保存済みコースを読み込めるようにする。
export const initializeField = (): FieldState => {
  const field: FieldState = Array(MAX_FIELD_WIDTH)
    .fill(null)
    .map(() => Array(MAX_FIELD_HEIGHT).fill(null))
  return field
}

// field上にstartがあるかをチェックする関数
export const isStart = (field: FieldState): boolean => {
  for (const row of field) {
    for (const panel of row) {
      if (panel === "start") return true
    }
  }
  return false
}

// field上にgoalがあるかをチェックする関数
export const isGoal = (field: FieldState): boolean => {
  for (const row of field) {
    for (const panel of row) {
      if (panel === "goal") return true
    }
  }
  return false
}

// 指定された位置にpanelを置く処理を行う関数
export const putPanel = (field: FieldState, row: number, col: number, mode: PanelValue): FieldState | null => {
  const newField = field.map((row) => [...row]) // フィールドのコピーを作成
  if (field[row][col] !== null) {
    newField[row][col] = null // panelを消す
    return newField
  }

  // start以外の場合、panelに隣接しているかどうかを確認
  if (mode !== "start") {
    // goalの場合、goalが既に配置されている場合は置けない
    if (mode === "goal" && isGoal(field)) {
      return null
    }
    let nextTo = false // panelが隣接しているかどうかのフラグ
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] // 4方向を表す配列
    // 各方向に対してループを行う
    directions.forEach(([dx, dy]) => {
      let x = row + dx
      let y = col + dy
      if (x >= 0 && x < MAX_FIELD_WIDTH && y >= 0 && y < MAX_FIELD_HEIGHT && field[x][y] !== null) {
        nextTo = true
        return
      }
    })
    if (!nextTo) {
      return null
    }
  } else if (isStart(field)) {
    return null
  }
  newField[row][col] = mode // panelを置く
  return newField
}

// FieldState型をString型に変換する関数
export const serializeField = (fieldState: FieldState): string => {
  return fieldState.map((row) => row.map((panel) => (panel === null ? "null" : panel)).join(",")).join(";")
}

// String型をFieldState型に変換する関数
export const deserializeField = (str: string): FieldState => {
  return str.split(";").map((row) => row.split(",").map((panel) => (panel === "null" ? null : (panel as PanelValue))))
}

// missionStateをString型に変換する関数
export const serializeMission = (missionState: MissionState): string => {
  return missionState.map((mission) => (mission === null ? "null" : mission)).join(";")
}

// String型をMissionState型に変換する関数
export const deserializeMission = (str: string): MissionState => {
  return str.split(";").map((mission) => (mission === "null" ? null : (mission as MissionValue)))
}

// String型からStartとGoal時の向き以外その他のミッションの配列を取得する関数
export const missionStatePair = (missionState: MissionState): MissionValue[][] => {
  // missionStateに最初のミッション(StartとGoalの向きを除く)が設定されていない場合、空配列を返す
  if (missionState[3] === null) {
    return []
  }

  const pairs = []
  for (let i = 2; i < missionState.length; i += 2) {
    // 多分、最後のpairは[ゴールの向き, null]になる
    pairs.push([missionState[i], missionState[i + 1]])
  }
  return pairs
}

// PointStateをString型に変換する関数
export const serializePoint = (pointState: PointState): string => {
  return pointState.map((point) => (point === null ? "null" : point)).join(";")
}

// String型をPointState型に変換する関数
export const deserializePoint = (str: string): PointState => {
  return str.split(";").map((point) => (point === "null" ? null : (point as unknown as PointValue)))
}
