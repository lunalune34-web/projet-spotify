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

        formatDuration(ms) { if (!ms) return '0:00'; const m = Math.floor(ms/60000), s = Math.floor((ms%60000)/1000); return `${m}:${s<10?'0':''}${s}`; },
        formatFollowers(n) { return n != null ? Number(n).toLocaleString('fr-FR') : '0'; },
        formatDate(str) { if (!str) return ''; const [y,m,d] = str.split('-'); return `${parseInt(d)} ${['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'][m-1]} ${y}`; },
        extractGenres(t) { return t?.artists ? [...new Set(t.artists.flatMap(a => a.genres ?? []))] : []; },
        bestImage(imgs) { return imgs?.at(-1)?.url ?? ''; },
        deezerUrl(id) { return `https://www.deezer.com/track/${id}`; },

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
// graphique pour les genress//
        buildGenresChart() {
            const c = {};
            this.tracks.forEach(t => t.artists.forEach(a => a.genres?.forEach(g => { c[g]=(c[g]||0)+1; })));
            const top = Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,6);
            new Chart(document.getElementById('genresChart'), {
                type:'pie', data:{ labels:top.map(([g])=>g), datasets:[{data:top.map(([,v])=>v),backgroundColor:['#971212','#4d0d0d','#0f3168','#52067e','#c5a4f2','#e7aed9','#e3edf7']}] },
                options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'right',labels:{boxWidth:12}}} }
            });
        }
    };
}