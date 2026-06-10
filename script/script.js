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

        // graphique pour les artistes//
        buildArtistsChart() {
            const c = {};
            this.tracks.forEach(t => t.artists.forEach(a => { c[a.name] = (c[a.name]||0)+1; }));
            const top = Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,10);
            new Chart(document.getElementById('artistsChart'), {
                type:'bar', data:{ labels:top.map(([n])=>n), datasets:[{data:top.map(([,v])=>v),backgroundColor:'#be9fc9'}] },
                options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}} }
            });
        },
    }
};