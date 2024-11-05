type ThreeTabsProps = {
  tab1Title: string
  tab1: JSX.Element
  tab2Title: string
  tab2: JSX.Element
  tab3Title: string
  tab3: JSX.Element
}

export const ThreeTabs = ({ tab1Title, tab1, tab2Title, tab2, tab3Title, tab3 }: ThreeTabsProps) => {
  return (
    <>
      <div className="flex-row justify-center w-full m-5 hidden md:inline-flex">
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

      <div role="tablist" className="tabs tabs-lifted md:hidden m-5">
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
    </>
  )
}
