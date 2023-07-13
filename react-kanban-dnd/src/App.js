import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const itemsFromBackend = [
  { id: uuidv4(), content: "First task" },

  { id: uuidv4(), content: "Second task" },
  { id: uuidv4(), content: "Third task" },
  { id: uuidv4(), content: <img src="https://www.epicwebtechno.com/wp-content/uploads/2018/07/cropped-logo.png" alt="img"></img> },
  
];

const columnsFromBackend = {
  [uuidv4()]: {
    name: "Task",
    items: itemsFromBackend,
  },
  [uuidv4()]: {
    name: "Todo",
    items:[],
  },
  [uuidv4()]: {
    name: "Completed",
    items:[],
  },
};



function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  // console.log(columns);


  const onDragEnd =(result)=>{
    // console.log(result);
    if(!result.destination) return
    const {source,destination} = result;

    if(source.droppableId !== destination.droppableId){
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const desItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index,1)
      desItems.splice(destination.index,0,removed)
      setColumns({
        ...columns,
        [source.droppableId]:{
          ...sourceColumn,
          items:sourceItems,
        },
        [destination.droppableId]:{
          ...destColumn,
          items:desItems
        }
      })



    }else{
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const[removed] =copiedItems.splice(source.index,1)
      copiedItems.splice(destination.index,0,removed)
      setColumns({
        ...columns,
        [source.droppableId]:{
          ...column,
          items:copiedItems
        }
      })

    }
  
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnId, column]) => {
          //  console.log(columnId);
          return (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <h2>{column.name}</h2>
              <div style={{margin:10}}>
            <Droppable droppableId={columnId} key={columnId}>
              {(provided, snapshot) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver
                        ? "lightblue"
                        : "lightgrey",
                      padding: 4,
                      width: 250,
                      minHeight: 500,
                    }}
                  >
                    {column.items.map((item, index) => {
                      return (
                        < Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => {
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: "none",
                                  padding: 16,
                                  margin: "0 0 8px 0",
                                  backgroundColor: snapshot.isDragging
                                    ? "#A78295"
                                    : "#3F2E3E",
                                  color: "white",
                                  ...provided.draggableProps.style,
                                }}
                              >
                                {item.content}
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}

                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
            </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;