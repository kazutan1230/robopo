import React, { useEffect, useState } from "react"
import Papa from "papaparse"

const CsvTable = ({ csvFile }: { csvFile: string }) => {
  const [data, setData] = useState<string[][]>([])

  console.log("csvFile: ", csvFile)

  useEffect(() => {
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setData(result.data)
      },
    })
  }, [csvFile])

  return (
    <div>
      <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{data.length > 0 && Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CsvTable
