import { useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { CalendarEvent, Navbar, CalendarModal, FabAddNew, FabDelete } from "../";
import { getMessagesES, localizer } from "../../helpers";
import { useAuthStore, useCalendarStore, useUIStore } from "../../hooks";



export const CalendarPage = () => {

    const { openDateModal } = useUIStore();
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
    const { user } = useAuthStore();

    const [lastUsedView, setLastUsedView] = useState(localStorage.getItem('lastView') || "week");

    const eventStyleGetter = ( event, start, end, isSelected ) => {

        const isMyEvent = (user.uid === event.user.id) || (user.uid === event.user.uid);


        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '#455660',
            borderRadius: '0px',
            opacity: 0.8,
            color: "white",
        };

        return {
            style
        };

    }

    const onDoubleClick = ( event ) => {
        openDateModal();
    }

    const onSelect = ( event ) => {
        // console.log({ click: event })
        setActiveEvent(event);
    }

    const onViewChanged = ( event ) => {
        localStorage.setItem("lastView", event);
    }

    useEffect(() => {
      startLoadingEvents();
    }, [])
    

    return (
        <>
            <Navbar />
            <Calendar
                localizer={localizer}
                events={events}
                defaultView={lastUsedView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "calc(100vh - 80px)" }}
                culture="es"
                messages={getMessagesES()}
                eventPropGetter={ eventStyleGetter }
                components= {{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />
            <CalendarModal />
            <FabDelete />
            <FabAddNew />
        </>
    );
};
