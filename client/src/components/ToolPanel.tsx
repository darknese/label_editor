import React from "react";

type Props = {
  onAddText: () => void;
  onAddRect: () => void;
//   onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedItem: any;
  updateElement: (id: string, newProps: any) => void;
  moveLayer: (id:string, direction: "up" | "down") => void;
  deleteSelected: (id: string) => void;
};

const ToolPanel = ({
  onAddText,
  onAddRect,
//   onUploadImage,
  selectedItem,
  updateElement,
  moveLayer,
  deleteSelected,
}: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <button onClick={onAddText}>➕ Текст</button>
      <button onClick={onAddRect}>⬛ Прямоугольник</button>
      {/* <label>
        🖼 Картинка
        <input type="file" accept="image/*" onChange={onUploadImage} />
      </label> */}
      {selectedItem && (
            <>
                <button onClick={() => deleteSelected(selectedItem.id)}> Удалить</button>
                <input
                    type="color"
                    value={selectedItem.props.fill}
                    onChange={(e) =>
                        updateElement(selectedItem.id, { fill: e.target.value })
                    }
                />
            </>
        )
        }

      {selectedItem?.type === "text" && (
        <>
          <input
            type="text"
            value={selectedItem.props.text}
            onChange={(e) =>{
              updateElement(selectedItem.id, { text: e.target.value })
              console.log(selectedItem.props.text, selectedItem.props.fontSize);}
            }
          />
          <input
            type="number"
            value={selectedItem.props.fontSize}
            onChange={(e) =>
              updateElement(selectedItem.id, { fontSize: +e.target.value })
            }
          />
          <input
            type="color"
            value={selectedItem.props.fill}
            onChange={(e) =>
              updateElement(selectedItem.id, { fill: e.target.value })
            }
          />
        </>
      )}

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => selectedItem && moveLayer(selectedItem.id,"up")}>🔼 Вверх</button>
        <button onClick={() => selectedItem && moveLayer(selectedItem.id,"down")}>🔽 Вниз</button>
      </div>
    </div>
  );
};

export default ToolPanel;
