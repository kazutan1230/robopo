"use client"

import type { SelectCourse } from "@/app/lib/db/schema"
import { useEffect, useState } from "react"
import { getCourseList, deleteCourse } from "@/app/course/listUtils"
import { useRouter } from "next/navigation"

export const List = () => {
	const [courseData, setCourseData] = useState<{
		selectCourses: SelectCourse[]
	}>({ selectCourses: [] })
	const [checkedCount, setCheckedCount] = useState<number>(0)
	const [checkedIds, setCheckedIds] = useState<number[]>([])
	const router = useRouter()
	useEffect(() => {
		async function fetchCourses() {
			const newCourseData: { selectCourses: SelectCourse[] } =
				await getCourseList()
			setCourseData(newCourseData)
		}
		fetchCourses()
	}, [])

	// 編集ボタンの動作
	const handleEdit = () => {
		console.log("checked: ", checkedIds)
		router.push(`/course/edit?id=${checkedIds[0]}`)
	}

	// 削除ボタンの動作
	const formAction = async (formData: FormData) => {
		const result = await deleteCourse(formData)
		const newCourseData: { selectCourses: SelectCourse[] } =
			await getCourseList()
		console.log("newCourseData: ", newCourseData)
		setCourseData(newCourseData)
		alert(result.message)
	}

	// チェックボタンを押した時の動作
	const handleCheckboxChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const { value, checked } = event.target
		const id = Number(value)
		let updatedCheckedIds = [...checkedIds]

		if (checked) {
			updatedCheckedIds.push(id)
		} else {
			updatedCheckedIds = updatedCheckedIds.filter(
				(selectedId) => selectedId !== id
			)
		}

		setCheckedIds(updatedCheckedIds)
		setCheckedCount(updatedCheckedIds.length)
	}

	return (
		<>
			<form action={formAction}>
				<div className="grid grid-cols-3">
					<div>
						<p>選択したコースを</p>
					</div>
					<div>
						<button
							type="button"
							className="btn btn-primary"
							disabled={checkedCount === 1 ? false : true}
							onClick={() => handleEdit()}>
							編集
						</button>
					</div>
					<div>
						<button
							type="submit"
							className="btn btn-warning"
							disabled={checkedCount === 0 ? true : false}>
							削除
						</button>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th>
									<label>
										<input
											type="checkbox"
											className="checkbox"
											disabled={true}
										/>
									</label>
								</th>
								<th>ID</th>
								<th>コース名</th>
								<th>作成日時</th>
							</tr>
						</thead>
						<tbody>
							{courseData ? (
								courseData.selectCourses.map(
									(courses: SelectCourse) => (
										<tr key={courses.id} className="hover">
											<th>
												<label>
													<input
														type="checkbox"
														className="checkbox"
														name="selectedIds"
														value={courses.id}
														onChange={
															handleCheckboxChange
														}
													/>
												</label>
											</th>
											<td>{courses.id}</td>
											<td>{courses.name}</td>
											<td>
												{courses.createdAt
													? new Date(
															courses.createdAt
													  ).toLocaleString(
															"ja-JP",
															{
																year: "numeric",
																month: "2-digit",
																day: "2-digit",
																hour: "2-digit",
																minute: "2-digit",
															}
													  )
													: "N/A"}
											</td>
										</tr>
									)
								)
							) : (
								<td colSpan={4}>コースはありません</td>
							)}
						</tbody>
					</table>
				</div>
			</form>
		</>
	)
}
