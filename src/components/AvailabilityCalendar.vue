<!-- src/components/AvailabilityCalendar.vue -->
<template>
    <section class="filters">
        <label>
            Property ID
            <input v-model="filters.property_id" @change="refetch" />
        </label>
        
        <label>
            Guests
            <input type="number" min="1" v-model.number="filters.guests" @change="refetch" />
        </label>
    </section>
    
    <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
            <div class="spinner"></div>
            <p>Loading availabilities...</p>
        </div>
    </div>
    <FullCalendar ref="calRef" :options="calendarOptions" class="fc-container" />
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios               from 'axios'
import FullCalendar        from '@fullcalendar/vue3'
import dayGridPlugin       from '@fullcalendar/daygrid'

/* --- filters the user can tweak --------------------------------------- */
const filters = reactive({ property_id: '1234', guests: 2 })

/* --- helper: Date → "YYYY-MM-DD" -------------------------------------- */
const toDate = d => d.toISOString().slice(0, 10)   // keep only date part

/* --- FullCalendar options --------------------------------------------- */
const calendarOptions = reactive({
    plugins      : [dayGridPlugin],
    initialView  : 'dayGridWeek',
    headerToolbar: { left: 'prev,next', center: 'title', right: '' },
    
    events: async (fetchInfo, success, failure) => {
        // Set loading to true at the very beginning of the fetch operation
        loading.value = true;
        
        /* 1. Force check‑in >= today to satisfy `after_or_equal:today` rule */
        const today   = new Date()
        today.setHours(0, 0, 0, 0); // Normalize today to start of day
        
        const start   = fetchInfo.start
        const end     = fetchInfo.end                               // end of week
        
        try {
            const response = await axios.get('/api/availability', {
                headers: {
                    'Authorization': `Bearer L5V9R0P2S4T6U8W0X2Y4Z6A8B0C2D4E6F8G0H1J3K5`,
                    'Content-Type': 'application/json'
                },
                params: { 
                    property_id: filters.property_id,
                    check_in: toDate(start), 
                    check_out: toDate(end),
                    guests: filters.guests,
                    full_availability: true 
                }
            });
            console.log(response);
            const roomList = Array.isArray(response.data.reply.rooms) ? response.data.reply.rooms : []
            console.log(roomList);
            const events = roomList.flatMap(room => 
                (room.availabilities || []).map(availability => ({
                    id: `${room.room_id}-${availability.date}`,
                    title: `Room ${room.room_id} — €${availability.price}`,
                    start: availability.date.split('T')[0], // Convert ISO date to YYYY-MM-DD
                    allDay: true
                }))
            );
            
            success(events)
        } catch (err) {
            console.error(err.response?.data || err)
            failure(err)
        } finally {
            // Set loading to false after fetch operation (success or failure)
            loading.value = false;
        }
    }
})

/* Handy refetch helper */
const calRef = ref(null)
function refetch () { calRef.value.getApi().refetchEvents() }

// Declare loading reactive variable
const loading = ref(true); // Set to true initially to show loading on first render
</script>

<style scoped>
.fc-container {
    width: 100%;
    margin: 1rem auto;
    border: 1px solid #e0e0e0; /* Softer border */
    border-radius: 8px; /* Slightly more rounded */
    padding: 15px; /* Increased padding */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Subtle shadow for depth */
    background-color: #ffffff;
}

.filters {
    display: flex;
    gap: 1.5rem; /* Increased gap between filter items */
    justify-content: center;
    margin-bottom: 1.5rem; /* Increased bottom margin */
    font-size: .95rem; /* Slightly larger font */
    padding: 1rem 1.5rem; /* Padding for the filter section */
    background-color: #f9f9f9; /* Light background */
    border-radius: 8px; /* Match calendar border-radius */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Subtle shadow */
    margin-left: auto;
    margin-right: auto;
}

.filters label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
    color: #333;
}

.filters input {
    padding: .4rem .6rem; /* Increased padding */
    border: 1px solid #d0d0d0; /* Softer border */
    border-radius: 5px; /* Slightly more rounded */
    margin-top: .4rem; /* Space between label and input */
    font-size: .9rem;
    width: 120px; /* Fixed width for consistency */
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.filters input:focus {
    border-color: #007bff; /* Highlight on focus */
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25); /* Focus ring */
    outline: none;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure it's on top */
}
.loading-content {
    background-color: #fff;
    padding: 30px 40px; /* More padding */
    border-radius: 10px; /* More rounded */
    text-align: center;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}
.loading-content p {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-top: 15px;
}
.spinner {
    border: 5px solid rgba(0, 123, 255, 0.2); /* Softer spinner border */
    border-top-color: #007bff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px; /* Adjust margin */
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.fc-view-harness{
    height: auto!important;
}
</style>
