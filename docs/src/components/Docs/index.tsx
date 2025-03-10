import type { ReactNode } from "react"
import clsx from "clsx"
import styles from "./styles.module.css"

type FeatureItem = {
  description: string
  src: string
}

const FeatureList: FeatureItem[] = [
  {
    description: "①採点する選手を選択",
    src: require("@site/static/img/screen/01_playername.webp").default,
  },
  {
    description: "②確認画面",
    src: require("@site/static/img/screen/02_confirm.webp").default,
  },
  {
    description: "③パネルをタップ(クリック)でロボットが進行。点が更新。",
    src: require("@site/static/img/screen/03_challenge_resize.webp").default,
  },
  {
    description: "④結果送信。",
    src: require("@site/static/img/screen/05_succsess.webp").default,
  },
]

function Feature({ description, src }: FeatureItem) {
  return (
    <div className={clsx("col col--6")}>
      <p>{description}</p>
      <div className="text--center">
        <img src={src} role="img" className={styles.featureImg} />
      </div>
      {/* <div className="text--center padding-horiz--md"><Heading as="h3">{title}</Heading></div> */}
    </div>
  )
}

export default function CourseCount(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
