import { addHours } from "date-fns";
import { useCalendarStore, useUIStore } from "../../hooks";

export const FabDelete = () => {
    const { startDeletingEvent, hasEventSelected } = useCalendarStore();

    const handleClickDelete = () => {
        startDeletingEvent();
    };

    return (
        <button
            className="btn btn-danger fab-delete"
            onClick={handleClickDelete}
            hidden={!hasEventSelected}
        >
            <i className="fas fa-trash-alt" />
        </button>
    );
};
