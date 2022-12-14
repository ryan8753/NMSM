import { createSlice } from "@reduxjs/toolkit"


// TODO: createAsyncThunk
/* 
info: {
	tripId: 여행 아이디,
	tripName: 여행 이름, 
	startDate: 시작 일자 (YYYY-MM-DD),
	periodInDays: 여행 일 수,
	budget: 여행 예산,
	vehicle: 주 교통 수단 (car, walk),
	style: 여행 스타일 (bit-masking),
	member: 	멤버 정보 배열
	  - kakaoId,
		- nickname,
		- imagePath,
}
 */

const initialState = {
	info: {
		tripId: 0,
		tripName: "",
		startDate: "",
		periodInDays: 0,
		budget: 0,
		vehicle: "",
		style: 0,
		member: []
	},
	schedules: [],
	isLoaded: false,
	error: null
}


const travelSlice = createSlice({
	name: "travel",
	initialState,
	reducers: {
		setTravelInfo(state, { payload }) {
			state.info = payload
		},
		editStayTime(state, { payload: {scheduleIdx, placeIdx, stayTime} }) {
			state.schedules[scheduleIdx][placeIdx]["stayTime"] = stayTime
		},
		editStartTime(state, { payload: {scheduleIdx, placeIdx, stayTime} }) {
			state.schedules[scheduleIdx][placeIdx]["stayTime"] = stayTime
		},
		setTravel(state, { payload }) {
			state[payload[0]] = payload[1]
		},
		initSchedule(state, { payload }) {
			state.schedules = payload
		},
		setSchedule(state, { payload: { scheduleIdx, schedule } }) {
			state.schedules[scheduleIdx] = schedule
		},
		swapSchedule(state, { payload: { day, turn1, turn2 } }) {
			const [removed] = state.schedules[day].splice(turn1, 1);
			state.schedules[day].splice(turn2, 0, removed);
		},
		deleteSchedule(state, { payload: {day, turn} }){
			state.schedules[day].splice(turn, 1)
		},
		addSchedule(state, { payload: { dayId, selectedSpots} }) {
			state.schedules[dayId].push(...selectedSpots)
		},
		setIsLoaded(state, { payload }) {
			state.isLoaded = payload
		},
		createSchedule(state, { payload: { day, spots } }) {
			if (!state.schedules[day].length) {
				return
			}

			state.schedules[day].splice(-1, 0, ...spots)
		}
	},
})

const { actions, reducer } = travelSlice

export const { editStartTime, editStayTime, setTravel, setTravelInfo, initSchedule, setSchedule, swapSchedule, deleteSchedule, addSchedule, setIsLoaded, createSchedule } = actions
export default reducer