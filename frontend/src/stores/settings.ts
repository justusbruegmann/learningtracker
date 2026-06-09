// stores/settings.ts
import {defineStore} from 'pinia'
import {supabase} from '../supabase.ts'

const BASEURL: any = import.meta.env.VITE_BACKENDURL;


export const useSettingsStore = defineStore('settings', {
    state: () => ({
        loaded: false,
        dailyGoalMins: 90,
        weeklyGoalMins: 300,
        weeklyGoalSessions: 5,
        activeDays: [1, 2, 3, 4, 5],
    }),
    actions: {
        async fetchSettings() {
            const {data: {session}} = await supabase.auth.getSession()

            if (!session) {
                return
            }

            const url: string = `${BASEURL}/settings`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });
            if (response.status !== 200) {
                return response.status;
            }
            const data = await response.json();
            this.dailyGoalMins = data[0].dailyGoalMins
            this.weeklyGoalMins = data[0].weeklyGoalMins
            this.weeklyGoalSessions = data[0].weeklyGoalSessions
            this.activeDays = typeof data[0].activeDays === 'string'
                ? data[0].activeDays.split(',').map(Number)
                : data[0].activeDays ?? this.activeDays
            this.loaded = true
        },
        async saveSettings(payload: any) {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                return
            }

            await fetch(`${BASEURL}/settings`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
        },
    }
})