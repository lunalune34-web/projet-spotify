function spotifyApp() {
    return {
        tracks: [], topAlbums: [], searchQuery: '', selectedTrack: null,

        async init() {
            try {
                this.tracks = await (await fetch('data/data.json')).json();
                this.buildAlbums(); this.buildArtistsChart(); this.buildGenresChart();
            } catch (e) { console.error(e); }
        },

        get filteredTracks() {
            const q = this.searchQuery.toLowerCase().trim();
            if (!q) return this.tracks;
            return this.tracks.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.artists.some(a => a.name.toLowerCase().includes(q)) ||
                t.album.name.toLowerCase().includes(q)
            );
        },

        buildAlbums() {
            const seen = new Map();
            for (const t of this.tracks) {
                if (!seen.has(t.album.id)) seen.set(t.album.id, t.album);
                if (seen.size === 12) break;
            }
            this.topAlbums = [...seen.values()];
        },
    }
};