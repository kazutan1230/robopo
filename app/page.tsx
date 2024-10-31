import { ChallengeTab, SummaryTab, CompetitionTab } from "@/app/components/home/tabs"

export default function Home() {
  return (
    <>
      <div className="flex-row justify-center w-full m-5 hidden md:inline-flex">
        <div className="w-1/3">
          <h1 className="text-2xl m-3">採点</h1>
          <ChallengeTab />
        </div>
        <div className="w-1/3">
          <h1 className="text-2xl m-3">集計結果</h1>
          <SummaryTab />
        </div>
        <div className="w-1/3">
          <h1 className="text-2xl m-3">大会管理</h1>
          <CompetitionTab />
        </div>
      </div>

      <div role="tablist" className="tabs tabs-lifted md:hidden m-5">
        <input type="radio" name="tabs" role="tab" className="tab whitespace-nowrap" aria-label="採点" defaultChecked />
        <div role="tabpanel" className="tab-content bg-base-100 border border-base-300 rounded-box p-6">
          <ChallengeTab />
        </div>
        <input type="radio" name="tabs" role="tab" className="tab whitespace-nowrap" aria-label="集計結果" />
        <div role="tabpanel" className="tab-content bg-base-100 border border-base-300 rounded-box p-6">
          <SummaryTab />
        </div>
        <input type="radio" name="tabs" role="tab" className="tab whitespace-nowrap" aria-label="大会管理" />
        <div role="tabpanel" className="tab-content bg-base-100 border border-base-300 rounded-box p-6">
          <CompetitionTab />
        </div>
      </div>
    </>
  )
}
