import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import "globalStyle.css"



// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    // list 얇은 복사하기
    const result = Array.from(list)
    // 리스트에서 제거하기
	const [removed] = result.splice(startIndex, 1)
    // 리스트에 추가하기
	result.splice(endIndex, 0, removed)
    
    console.log(result)
	return result
}

const grid = 8

// 내부 아이템 style
const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the spots look a bit nicer
	userSelect: "none",
	padding: grid * 2,
	margin: `0 0 ${grid}px 0`,
    border: "5px solid #BBDEFB",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "10px",
	// change background colour if dragging
	background: isDragging ? "rgba(0, 0, 0, 0.25)" : "white",
	// styles we need to apply on draggables
	...draggableStyle
});

const getListStyle = () => ({
	padding: grid,
    width: 310,
    position: "relative",
    margin: "auto"
});

const queryAttr = "data-rbd-drag-handle-draggable-id";

function Spots({routes}) {
    console.log(routes)
	const [spots, setSpots] = useState(routes)
    const [placeholderProps, setPlaceholderProps] = useState({})

    
	const onDragEnd = result => {
        // dropped outside the list
		if (!result.destination) {
            return
		}
        
        setPlaceholderProps({})
		setSpots(spots => reorder(spots, result.source.index, result.destination.index))
	};
    
    // 드래그할 동안
	const onDragUpdate = update => {
        if(!update.destination){
            return
        }
		const draggableId = update.draggableId
		const destinationIndex = update.destination.index
        
		const domQuery = `[${queryAttr}='${draggableId}']`
		const draggedDOM = document.querySelector(domQuery)
        
		if (!draggedDOM) {
            return
		}
		const { clientHeight, clientWidth } = draggedDOM;
        
		const clientY = parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) + [...draggedDOM.parentNode.children]
        .slice(0, destinationIndex)
        .reduce((total, curr) => {
            const style = curr.currentStyle || window.getComputedStyle(curr)
            const marginBottom = parseFloat(style.marginBottom)
            return total + curr.clientHeight + marginBottom
        }, 0)
        
		setPlaceholderProps({
            clientHeight,
			clientWidth,
            clientY,
            clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft)
		})
	}
    
	return (
        <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
			<Droppable droppableId="droppable">
				{(provided, snapshot) => (
                    
                    <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
					>
						{spots.map((item, index) => (
                            <Draggable key={index} draggableId={index.toString()} index={index}>
								{(provided, snapshot) => (
                                    <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
										)}
                                        >
                                        <h1 className="content-size inline-block">{item.name}</h1>
                                        <span className="content-size">{item.duration}</span>
									</div>
								)}
							</Draggable>
						))}

						{provided.placeholder}
            {/* <CustomPlaceholder snapshot={snapshot} /> */}
            {/* <div style={{
                position: "absolute",
                top: placeholderProps.clientY,
                left: placeholderProps.clientX,
                height: placeholderProps.clientHeight,
                background: "tomato",
                width: placeholderProps.clientWidth
            }}/> */}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};



export default Spots
