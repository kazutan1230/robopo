// コース作成の最大サイズ
export const MAX_FIELD_WIDTH: number = 5
export const MAX_FIELD_HEIGHT: number = 5

// Panelの種類
export type PanelValue = "start" | "goal" | "route" | null
export type FieldState = PanelValue[][]

// 初期配置を表示する関数。ゆくゆくは保存済みコースを読み込めるようにする。
export const initializeField = (): FieldState => {
  const field: FieldState = Array(MAX_FIELD_WIDTH).fill(null).map(() => Array(MAX_FIELD_HEIGHT).fill(null))
  return field
}

// field上にstartがあるかをチェックする関数
export const isStart = (field: FieldState): boolean => {
  for(const row of field) {
    for(const panel of row) {
      if (panel === "start") return true
    }
  }
  return false
}

// field上にgoalがあるかをチェックする関数
export const isGoal = (field: FieldState): boolean => {
  for(const row of field) {
    for(const panel of row) {
      if (panel === "goal") return true
    }
  }
  return false
}

// 指定された位置にpanelを置く処理を行う関数
export const putPanel = (field: FieldState, row: number, col: number, mode: PanelValue): FieldState | null => {
  const newField = field.map(row => [...row]) // フィールドのコピーを作成
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
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]] // 4方向を表す配列
    // 各方向に対してループを行う
    directions.forEach(([dx, dy]) => {
      let x = row + dx
      let y = col + dy
      if(x >= 0 && x < MAX_FIELD_WIDTH && y >= 0 && y < MAX_FIELD_HEIGHT && field[x][y] !== null) {
        nextTo = true
        return
      }
    }) 
    if (!nextTo) {
      return null
    }
  }else if (isStart(field)) {
    return null
  }
  newField[row][col] = mode // panelを置く
  return newField
}

// field状態を保存するためにstringにする関数
export const serializeField = (field: FieldState): string => {
  return JSON.stringify(field)
}

// field状態を復元するためにstringからFieldStateにする関数
export const deserializeField = (field: string): FieldState => {
  return JSON.parse(field)
}
   

  // ゲームの勝者をチェックする関数
  // export const checkWinner = (field: FieldState): Player | "draw" | null => {
  //   const { black, white } = countStones(field);
  
  //   if (black + white === 64 || black === 0 || white === 0) { // 全てのマスが埋まったか、どちらかの石がなくなった場合
  //     if (black > white) return "black";
  //     if (white > black) return "white";
  //     return "draw";
  //   }
  
  //   return null; // ゲームがまだ続いている場合はnullを返す
  // };
  
  // 現在のプレイヤーが石を置ける場所があるかどうかをチェックする関数
  // export const canMakeMove = (field: FieldState, mode: Player): boolean => {
  //   for (let row = 0; row < 8; row++) {
  //     for (let col = 0; col < 8; col++) {
  //       if (makeMove(field, row, col, mode)) {
  //         return true; // 石を置ける場所がある場合はtrueを返す
  //       }
  //     }
  //   }
  //   return false; // 石を置ける場所がない場合はfalseを返す
  // };