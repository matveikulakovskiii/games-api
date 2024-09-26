const vue = Vue.createApp({
    data() {
        return {
            gameInModal: {name: null},
            games: []
        }
    },
    async created() {
        // Получение списка игр при создании компонента
        this.games = await (await fetch('http://localhost:8080/games')).json();
    },
    methods: {
        getGame: async function (id) {
            // Получение данных об одной игре по id
            this.gameInModal = await (await fetch(`http://localhost:8080/games/${id}`)).json();
            let gameInModal = new bootstrap.Modal(document.getElementById('gameInModal'), {});
            gameInModal.show();
        }
    }
}).mount('#app');
