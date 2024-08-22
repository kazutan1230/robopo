import Link from "next/link"


export default function Home() {
  return (
    <>
    <div className="grid grid-cols-2 gap-4 text-center xl:max-w-5xl lg:max-w-3xl w-full h-full">
    <Link href="/challenge" className="btn btn-primary min-w-28 max-w-fit mx-auto">
        採点
    </Link>
    <Link href="/summary" className="btn btn-primary min-w-28 max-w-fit mx-auto">
        集計結果
    </Link>
    <Link href="/course" className="btn btn-primary min-w-28 max-w-fit mx-auto">
        コース作成
    </Link>
    <Link href="/competition" className="btn btn-primary min-w-28 max-w-fit mx-auto">
        大会管理
    </Link>
    </div>
  </>
  )
}
