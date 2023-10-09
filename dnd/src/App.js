import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

const ItemTypes = {
  COMPONENT: 'component',
};

const Component = ({ id, name, index, components, onDragEnd, onAddComponent }) => {
  return (
    <Draggable
      draggableId={id}
      index={index}
      onStart={() => onAddComponent(id)}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="component"
        >
          {name}
          <Droppable droppableId={id} type={ItemTypes.COMPONENT}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {components.map((child, childIndex) => (
                  <Component
                    key={child.id}
                    id={child.id}
                    name={child.name}
                    index={childIndex}
                    components={child.components}
                    onDragEnd={onDragEnd}
                    onAddComponent={onAddComponent}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

const ZonesData = {
  'Zone A': {
    allowedTypes: ['Type A'],
    components: [
      {
        id: '1',
        name: 'Component 1',
        type: 'Type A',
        components: [],
      },
      {
        id: '4',
        name: 'Component 4',
        type: 'Type A',
        components: [],
      },
    ],
  },
  'Zone B': {
    allowedTypes: ['Type B'],
    components: [
      {
        id: '3',
        name: 'Component 3',
        type: 'Type B',
        components: [],
      },
      {
        id: '2',
        name: 'Component 2',
        type: 'Type B',
        components: [],
      },
    ],
  },
  'Zone C': {
    allowedTypes: ['Type A', 'Type B'],
    components: [],
  },
};

const App = () => {
  const [zones, setZones] = useState(ZonesData);
  const [draggedComponent, setDraggedComponent] = useState(null);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceZoneId = result.source.droppableId;
    const destinationZoneId = result.destination.droppableId;
    const sourceZone = zones[sourceZoneId];
    const destinationZone = zones[destinationZoneId];
    const movedComponent = sourceZone.components[result.source.index];

    // Check if the component type is allowed in the destination zone
    if (
      !destinationZone ||
      !destinationZone.allowedTypes.includes(movedComponent.type)
    )
      return;

    const updatedZones = { ...zones };
    const sourceComponents = updatedZones[sourceZoneId].components;
    const destinationComponents = updatedZones[destinationZoneId].components;

    // Remove the component from the source zone
    sourceComponents.splice(result.source.index, 1);

    // Insert the component into the destination zone
    destinationComponents.splice(result.destination.index, 0, movedComponent);

    setZones(updatedZones);
  };

  const onAddComponent = (parentId) => {
    const newComponentId = Date.now().toString();
    const newComponent = {
      id: newComponentId,
      name: `New Component ${newComponentId}`,
      type: 'Type A', // You can change the type as needed
      components: [],
    };

    const updatedZones = { ...zones };
    const parentZone = Object.values(updatedZones).find((zone) =>
      zone.components.find((component) => component.id === parentId)
    );

    if (parentZone) {
      const parentComponent = parentZone.components.find(
        (component) => component.id === parentId
      );
      parentComponent.components.push(newComponent);
      setZones(updatedZones);
    }
  };

  return (
    <div className="container">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(zones).map(([zoneName, zone]) => (
          <Droppable
            key={zoneName}
            droppableId={zoneName}
            type={ItemTypes.COMPONENT}
          >
            {(provided) => (
              <div
                className="zone"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h3>{zoneName} Zone</h3>
                {zone.components.map((component, index) => (
                  <Component
                    key={component.id}
                    id={component.id}
                    name={component.name}
                    index={index}
                    components={component.components}
                    onDragEnd={onDragEnd}
                    onAddComponent={onAddComponent}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>

      {/* Render the dragged component as a placeholder */}
      {draggedComponent && (
        <div className="dragged-component">
          {draggedComponent.name}
        </div>
      )}
    </div>
  );
};

export default App;
