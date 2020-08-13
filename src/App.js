/* eslint-disable eqeqeq */
import React, { useState } from "react";
import "./App.css";

function App() {
  const [cameras, setCameras] = useState([{ id: 1, order: 0, foo: "br" }]);
  const [itemPerRow, setItemPerRow] = useState(4);
  const [curentDropableElm, setCurentDropableElm] = useState();
  const [currentDraggedEl, setCurrentDruggedEl] = useState({
    el: null,
    coord: null,
    id: undefined,
  });

  const addNew = (e) => {
    e.preventDefault();
    setCameras((prevState) => {
      console.log(prevState);
      return [
        ...prevState,
        {
          id: prevState.length + 1,
          order: prevState.length,
        },
      ];
    });
  };

  const removeItem = (id) => {
    setCameras(cameras.filter((camera) => camera.id !== id));
  };

  const handleItemPerRowChange = (e) => {
    const value = e.target.value;
    setItemPerRow((prevState) => (value <= 8 ? value : prevState));
  };

  // after drag end reorder the item accordingly
  const reOrderItems = (draggedItemOrder, replaceMentItemOrder) => {
    console.log(draggedItemOrder, replaceMentItemOrder);
    /**
     * On drag & replacment operation there is 2 scenario,
     * 1. Eiither draggedItemIndex > replacementItemOrder
     * 2. Or draggedItemIndex < replacementItemOrder
     * On former, the order should be decremental up to draggedItemIndex
     * On later, ther order would be incremental from replaceMentItemIndex up to n (count of item)
     */
    const cam = [...cameras];
    if (draggedItemOrder > replaceMentItemOrder) {
      const sliced = cam
        .slice(replaceMentItemOrder, draggedItemOrder)
        .map((item) => {
          item.order += 1;
          return item;
        });

      console.log(sliced, cam);
    }
  };

  const handleDragStart = (e, id) => {
    const dragEl = e.target;
    e.dataTransfer.dropEffect = "move";
    // visual clue that this item is being dragged/moved
    e.target.style.opacity = "0.3";

    const { height, width, top, left } = dragEl.getBoundingClientRect();
    setCurrentDruggedEl({
      el: dragEl,
      coord: { topRight: left + width, bottomRight: top + height },
      id,
    });
  };

  const handleDragOver = (e) => {
    const targetEl = e.target;
    e.dataTransfer.dropEffect = "move";

    // position of the target element in viewport
    const targetElPosition = targetEl.getBoundingClientRect();
    const { el } = currentDraggedEl;

    if (targetEl !== el) {
      if (
        e.clientX > targetElPosition.left ||
        e.clientY > targetElPosition.top
      ) {
        setCurentDropableElm(targetEl);
      }
    } else {
      setCurentDropableElm(currentDraggedEl);
    }
  };

  const handleDragEnd = (e) => {
    // reset the opacity to 1 when an element has been dragged
    e.preventDefault();
    e.stopPropagation();
    e.target.style.opacity = 1;

    if (curentDropableElm !== currentDraggedEl.el) {
      reOrderItems(
        currentDraggedEl.el.style.order,
        curentDropableElm.style.order
      );
    }

    setCurrentDruggedEl({});
  };

  return (
    <>
      <div className="settingPanel">
        <button onClick={addNew} type="button">
          Add one
        </button>
        <input
          type="number"
          value={itemPerRow}
          onChange={handleItemPerRowChange}
        />
      </div>
      <div className="grid">
        {cameras.map(({ id, order }) => (
          <div
            draggable={true}
            style={{ background: `hsla(${id * 50},100%,50%,0.3)`, order }}
            onDragStart={(e) => handleDragStart(e, id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            {id}
            <br />
            <span title="remove" onClick={() => removeItem(id)}>
              X
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
