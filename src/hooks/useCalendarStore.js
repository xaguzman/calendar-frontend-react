import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import calendarApi from "../api/calendar-api";
import { convertEventsToDateEvents } from "../helpers/convertEventsToDateEvents";
import {
    onAddNewEvent,
    onDeleteEvent,
    onLoadEvents,
    onSetActiveEvent,
    onUpdateEvent,
} from "../store/calendar/calendar-slice";

export const useCalendarStore = () => {
    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector((state) => state.calendar);
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    };

    const startSavingEvent = async (calendarEvent) => {
        try {

            if (calendarEvent.id) {
                // update
    
                await calendarApi.put(`/events/${calendarEvent.id }`, { ...calendarEvent, user: calendarEvent.user.id });
                dispatch(onUpdateEvent ({...calendarEvent, user }));
                return;
    
            }
            
            
    
            // insert
            const { _user, bgColor, ...newEvent } = calendarEvent;
            newEvent.user = user.id;
            const { data } = await calendarApi.post('/events', newEvent)
            console.log( data );
    
            dispatch(
                onAddNewEvent({ ...calendarEvent, id: data.model.id, user })
            );
            
        } catch (error) {
            console.log(error);
            Swal.fire("Error al guardar", error.response.data.message, 'error');
        }
    };

    const startDeletingEvent = async () => {

        try {
            
            await calendarApi.delete(`/events/${activeEvent.id }`);
    
            dispatch ( onDeleteEvent() );
        } catch (error) {
            console.log(error);
            Swal.fire("Error al eliminar", error.response.data.message, 'error');
        }
    }

    const startLoadingEvents = async() => {
        try{
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents( data.events );
            dispatch ( onLoadEvents(events) );
            console.log(events);
        }catch(error){
            console.log('Error cargando eventos');
            console.log(error);
        }
    }

    return {
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        setActiveEvent,
        startLoadingEvents,
        startSavingEvent,
        startDeletingEvent
    }
};
