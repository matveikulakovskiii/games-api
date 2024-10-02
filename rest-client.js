const vue = Vue.createApp({
    data() {
        return {
            gameInModal: {id: null, name: '', price: null},
            games: [],
            newGame: {name: '', price: null}
        }
    },
    async created() {
        this.games = await (await fetch('http://localhost:8080/games')).json();
    },
    methods: {
        getGame: async function (id) {

            this.gameInModal = await (await fetch(`http://localhost:8080/games/${id}`)).json();
            let gameInModal = new bootstrap.Modal(document.getElementById('gameInModal'), {});
            gameInModal.show();
        },
        addGame: async function () {

            const response = await fetch('http://localhost:8080/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.newGame),
            });

            if (response.ok) {
                const addedGame = await response.json();
                this.games.push(addedGame);
                this.newGame = {name: '', price: null};
            }
        },
        deleteGame: async function (id) {

            const response = await fetch(`http://localhost:8080/games/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                this.games = this.games.filter(game => game.id !== id);
            }
        },
        openAddModal: function(game) {

            this.gameInModal = {...game};
            let addGameModal = new bootstrap.Modal(document.getElementById('addGameModal'), {});
            addGameModal.show();
        }
    }
}).mount('#app');
