/* eslint-disable eqeqeq */
import React, { useState, useRef } from "react";
import "./App.css";
import Camera from "./components/camera";
import useCamera from "./hooks/useCamera";

function App() {
  const [cameras, setCameras] = useState([{ id: 1, order: 0 }]);
  const [itemPerRow, setItemPerRow] = useState(4);
  const [stream] = useCamera();
  const [curentDropableElm, setCurentDropableElm] = useState({
    el: null,
    order: undefined,
  });
  const [currentDraggedEl, setCurrentDruggedEl] = useState({
    el: null,
    id: undefined,
  });

  const addNew = (e) => {
    e.preventDefault();
    setCameras((prevState) => {
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
     * On later, ther order would be incremental from replaceMentItemIndex up to draggedItemIndex
     */

    if (draggedItemOrder > replaceMentItemOrder) {
      const reOrdered = cameras.map((camera) => {
        if (
          camera.order >= replaceMentItemOrder &&
          camera.order < draggedItemOrder
        ) {
          camera.order += 1;
          return camera;
        } else if (camera.order == draggedItemOrder) {
          camera.order = replaceMentItemOrder;
          return camera;
        }

        return camera;
      });

      console.log(reOrdered);
    } else {
      setCameras(
        cameras.map((camera) => {
          if (
            camera.order <= replaceMentItemOrder &&
            camera.order > draggedItemOrder
          ) {
            camera.order -= 1;
            return camera;
          } else if (camera.order == draggedItemOrder) {
            camera.order = replaceMentItemOrder;
            return camera;
          }

          return camera;
        })
      );
    }
  };

  const handleDragStart = (e, order) => {
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    // visual clue that this item is being dragged/moved
    e.target.style.opacity = "0.3";
    const dragEl = e.target;

    setCurrentDruggedEl({
      el: dragEl,
      order,
    });
  };

  const handleDragOver = (e, order) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    // position of the target element in viewport
    const targetEl = e.target;
    const targetElPosition = targetEl.getBoundingClientRect();

    if (order !== currentDraggedEl.order) {
      if (
        (e.clientX > targetElPosition.left ||
          e.clientY > targetElPosition.top) &&
        curentDropableElm.el !== targetEl
      ) {
        setCurentDropableElm({ el: targetEl, order });
      }
    } else {
      setCurentDropableElm(currentDraggedEl);
    }
  };

  const handleDragEnd = (e) => {
    // reset the opacity to 1 when an element has been dragged
    e.target.style.opacity = 1;

    if (curentDropableElm.order !== currentDraggedEl.order) {
      reOrderItems(
        parseInt(currentDraggedEl.order, 10),
        parseInt(curentDropableElm.order, 10)
      );
    }

    setCurrentDruggedEl({});
    setCurentDropableElm({});
  };

  return (
    <>
      <div className="settingPanel">
        <button onClick={addNew} type="button">
          Add one
        </button>
        {/* <label className="formElm" htmlFor="columnCount">
          <span>Number of column per row</span>
          <input
            type="number"
            value={itemPerRow}
            id="columnCount"
            onChange={handleItemPerRowChange}
          />
        </label> */}
      </div>
      <div className="grid">
        {cameras.map((cameraItem) => (
          <Camera
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            item={cameraItem}
            onRemove={removeItem}
            stream={stream}
            dragOrder={curentDropableElm.order}
          />
        ))}
      </div>
    </>
  );
}

export default App;
