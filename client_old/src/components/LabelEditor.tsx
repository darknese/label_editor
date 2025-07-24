import React, { useState, useRef, useEffect } from "react";
import { useTransformerBinding } from "../features/hooks/useTransformerBinding";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import ToolPanel from "./ToolPanel";
import { useEditorStore } from "../store/useEditorStore";
const CANVAS_SIZE = 500;



const LabelEditor = () => {
  const {
    elements,
    selectedId,
    addElement,
    updateElement,
    setSelectedId,
    moveLayer,
    deleteSelected
  } = useEditorStore();

  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const containerRef = useRef<any>(null);

  
  const downloadURI = (uri: any, name: any)  => {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function useImage(src?: string) {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
      if (!src) {
        setImage(null);
        return;
      }
      const img = new window.Image();
      img.src = src;
      img.onload = () => setImage(img);
      img.onerror = () => setImage(null);
    }, [src]);

    return image;
  }
  const selectedItem = selectedId ? elements.find((elem) => elem.id === selectedId) : null;

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    console.log(uri);
    downloadURI(uri, 'stage.png');
  };
  
  const handleAddText = () => {
    const id = crypto.randomUUID();
    addElement(
      {
        id,
        type: "text",
        props: {
          id,
          x: 50,
          y: 50,
          text: "Текст",
          fontSize: 20,
          fill: "black",
          draggable: true,
        },
      },
    );
  };

  const handleAddRect = () => {
    const id = crypto.randomUUID();
    addElement(
      {
        id,
        type: "rect",
        props: {
          id,
          x: 100,
          y: 100,
          width: 100,
          height: 50,
          fill: "lightblue",
          draggable: true,
        },
      },
    );
  };

  // const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = function () {
  //     const image = new window.Image();
  //     image.src = reader.result as string;
  //     image.onload = function () {
  //       const id = crypto.randomUUID();
  //       addElement(
  //         {
  //           id,
  //           type: "image",
  //           props: {
  //             x: 150,
  //             y: 150,
  //             width: 100,
  //             height: 100,
  //             draggable: true,
  //             src
  //           },
  //         },
  //       );
  //     };
  //   };
  //   reader.readAsDataURL(file);
  // };
  


  useEffect(() => {
    // focus the div on mount
    containerRef.current.focus();
  }, []);

  const handleKeyDown = (e: any) => {
    switch (e.keyCode) {
      case 8: // backspase
        if (selectedId) deleteSelected()
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  useTransformerBinding({selectedId,stageRef,trRef})

  return (
    <div 
      style={{ display: "flex", gap: "20px" }}
    >
      {/* Канвас */}
      <div 
        style={{ display: "flex", gap: "20px" }}
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <Stage
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          ref={stageRef}
          style={{ border: "2px solid black" }}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) {
              setSelectedId(null);
            }
          }}
        >
          <Layer>
            {/* Объекты */}
            {elements.map((elem) => {
              const commonProps = {
                key: elem.id,
                ...elem.props,
                onClick: () => setSelectedId(elem.id),
                onDragEnd: (e: any) =>
                  updateElement(elem.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  }),
              };

              switch (elem.type) {
                case "text":
                  return <Text {...commonProps} />;
                case "rect":
                  return <Rect {...commonProps} />;
                // case "image":
                //   return (
                //     <KonvaImage
                //       key={elem.id}
                //       image={imageObj}
                //       x={elem.props.x}
                //       y={elem.props.y}
                //       width={elem.props.width}
                //       height={elem.props.height}
                //       draggable
                //     />
                //   );
                default:
                  return null;
              }
            })}
            {/* Transformer — трансформирует только выбранный объект */}
            {selectedId && <Transformer ref={trRef} />}
          </Layer>
        </Stage>
      </div>

      {/* Панель инструментов */}
      <div>
        <ToolPanel
          onAddText={handleAddText}
          onAddRect={handleAddRect}
          // onUploadImage={handleUploadImage}
          selectedItem={selectedItem}
          updateElement={updateElement}
          moveLayer={moveLayer}
          deleteSelected={deleteSelected}
        /></div>
    </div>
  );
};

export default LabelEditor;


