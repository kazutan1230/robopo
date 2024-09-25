import Link from "next/link"

export default function Home() {
  return (
    <>
      {/* vercelでdeployして表示する際に、Linkをいちいちgetしてる感じがするので、一旦コメントアウト */}
      <div className="flex flex-col justify-center items-center w-full h-2/3">
        <div className="flex justify-center w-full">
          <Link href="/challenge" className="btn btn-primary min-w-36 min-h-20 text-3xl max-w-fit mx-5">
            採点
          </Link>
          <Link href="/summary" className="btn btn-primary min-w-36 min-h-20 text-3xl max-w-fit mx-5">
            集計結果
          </Link>
        </div>
        <div className="flex justify-center w-full mt-10">
          <Link href="/course" className="btn btn-primary min-w-36 min-h-20 text-3xl max-w-fit mx-5">
            コース
            <br />
            作成
          </Link>
          <button className="btn btn-primary min-w-36 min-h-20 text-3xl max-w-fit mx-5" disabled>
            大会管理
          </button>
          {/* <Link href="/competition" className="btn btn-primary min-w-36 min-h-20 text-3xl max-w-fit mx-5">
            大会管理
          </Link> */}
        </div>
      </div>
    </>
  )
}
