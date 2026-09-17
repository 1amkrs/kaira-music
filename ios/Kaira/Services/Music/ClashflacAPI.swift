import Foundation

public final class ClashflacAPI: Sendable {
    public static let shared = ClashflacAPI()
    
    public static let curatedTracks: [AudioTrack] = [
        AudioTrack(
            id: "track-flac-01",
            title: "vampire",
            artist: "Olivia Rodrigo",
            album: "GUTS",
            duration: 219,
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273e85259a1cae29a8d91f2093d",
            streamUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/70/2f/a6/702fa6b5-946c-7a8e-2dba-03de25c732d3/mzaf_12764345117177639836.plus.aac.p.m4a",
            quality: .hiRes192,
            bitDepth: 24,
            sampleRate: 192_000,
            codec: "FLAC",
            clashflacId: "clash_hi_res_001",
            youtubeId: "Fqey8LxQxFU",
            lyricsLrc: """
            [00:00.00]Hate to give the satisfaction, undressing when I'm mad at you
            [00:06.18]I should've known it was strange you only come out at night
            [00:11.45]I used to think I was smart, but you made me look so naive
            [00:16.82]The way you sold me for parts, and you sunk your teeth into me, oh
            [00:22.40]Bloodsucker, fame fucker
            [00:27.50]Bleedin' me dry like a goddamn vampire
            [00:33.20]Every girl I ever talked to told me you were bad, bad news
            [00:38.70]You called them crazy, God, I hate the way I called 'em crazy too
            [00:44.20]You're so convincing
            [00:47.00]How do you lie without flinching?
            [00:49.80]How do you lie, how do you lie, how do you lie?
            [00:55.00]'Cause girls your age know better
            [00:58.20]Bloodsucker, fame fucker
            [01:03.50]Bleedin' me dry like a goddamn vampire
            """
        ),
        AudioTrack(
            id: "track-flac-02",
            title: "LUNCH",
            artist: "Billie Eilish",
            album: "HIT ME HARD AND SOFT",
            duration: 180,
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62",
            streamUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9d/3e/43/9d3e43aa-682a-7979-8547-d339956c409b/mzaf_710286407585135494.plus.aac.p.m4a",
            quality: .hiRes192,
            bitDepth: 24,
            sampleRate: 192_000,
            codec: "FLAC",
            clashflacId: "clash_hi_res_002",
            youtubeId: "MB3VkzPdgLA",
            lyricsLrc: """
            [00:00.00]I could eat that girl for lunch
            [00:03.80]Yeah, she dances on my tongue
            [00:07.50]Tastes like she might be the one
            [00:11.20]And I can never get enough
            [00:15.00]I could buy her so much stuff
            [00:18.50]It's a craving, not a crush, huh
            [00:22.50]'Call me when you're there'
            [00:24.80]Said, 'I bought you something rare'
            [00:27.00]And I left it under 'stairs'
            """
        ),
        AudioTrack(
            id: "track-flac-03",
            title: "Blinding Lights",
            artist: "The Weeknd",
            album: "After Hours",
            duration: 200,
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
            streamUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/94/d5/43/94d5438d-6eef-89a3-577e-e5d0a51e604f/mzaf_10098906660144908000.plus.aac.p.m4a",
            quality: .hiRes192,
            bitDepth: 24,
            sampleRate: 192_000,
            codec: "FLAC",
            clashflacId: "clash_hi_res_003",
            youtubeId: "4NRXx6U8ABQ",
            lyricsLrc: """
            [00:00.00]Yeah
            [00:12.50]I've been tryna call
            [00:15.80]I've been on my own for long enough
            [00:20.50]Maybe you can show me how to love, maybe
            [00:27.50]I'm going through withdrawals
            [00:30.80]You don't even have to do too much
            [00:35.50]You can turn me on with just a touch, baby
            [00:41.50]I look around and Sin City's cold and empty
            [00:48.50]No one's around to judge me
            [00:52.50]I can't see clearly when you're gone
            [00:58.50]I said, ooh, I'm blinded by the lights
            [01:06.00]No, I can't sleep until I feel your touch
            """
        ),
        AudioTrack(
            id: "track-flac-04",
            title: "360",
            artist: "Charli xcx",
            album: "BRAT",
            duration: 133,
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273810cd044b7e88383ee7246b9",
            streamUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/31/6f/c8/316fc8c8-b220-e29f-3d62-d922a9451152/mzaf_7867084511874281691.plus.aac.p.m4a",
            quality: .losslessCD,
            bitDepth: 16,
            sampleRate: 44_100,
            codec: "FLAC",
            clashflacId: "clash_lossless_004",
            youtubeId: "WJW-VvmrkS8",
            lyricsLrc: """
            [00:00.00]I went to the city, I went to the club
            [00:04.20]I saw everybody, everybody showed me love
            [00:08.50]I'm everywhere, I'm so Julia
            [00:12.80]Ah-ah, ah-ah, ah
            [00:17.00]When you're in the mirror, do you like what you see?
            [00:21.20]When you're in the mirror, do you look at me?
            [00:25.50]I'm everywhere, I'm so Julia
            """
        ),
        AudioTrack(
            id: "track-flac-05",
            title: "Karma Police",
            artist: "Radiohead",
            album: "OK Computer",
            duration: 261,
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273c8b444df094179b770396495",
            streamUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/21/35/46213520-da4a-1806-0c59-5ca6ad008b4e/mzaf_5277404092043261430.plus.aac.p.m4a",
            quality: .hiRes96,
            bitDepth: 24,
            sampleRate: 96_000,
            codec: "FLAC",
            clashflacId: "clash_hi_res_005",
            youtubeId: "4IJI6soiQhI",
            lyricsLrc: """
            [00:00.00]Karma police, arrest this man
            [00:06.50]He talks in maths, he buzzes like a fridge
            [00:13.20]He's like a detuned radio
            [00:19.80]Karma police, arrest this girl
            [00:26.50]Her Hitler hairdo is making me feel ill
            [00:33.20]And we have crashed her party
            [00:40.00]This is what you'll get
            [00:46.50]This is what you'll get
            """
        ),
        AudioTrack(
            id: "track-flac-06",
            title: "Espresso",
            artist: "Sabrina Carpenter",
            album: "Short n' Sweet",
            duration: 175,
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273fd8d7a8d96871e791cb1f628",
            streamUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e9/4d/02/e94d0230-11ee-ef94-d2cf-a5d547bd73f4/mzaf_554140808559155562.plus.aac.p.m4a",
            quality: .hiRes192,
            bitDepth: 24,
            sampleRate: 192_000,
            codec: "FLAC",
            clashflacId: "clash_hi_res_006",
            youtubeId: "eVli-tstM5E",
            lyricsLrc: """
            [00:00.00]Now he's thinkin' 'bout me every night, oh
            [00:04.20]Is it that sweet? I guess so
            [00:08.50]Say you can't sleep, baby, I know
            [00:12.80]That's that me, espresso
            """
        ),
        AudioTrack(
            id: "track-flac-07",
            title: "HUMBLE.",
            artist: "Kendrick Lamar",
            album: "DAMN.",
            duration: 177,
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699",
            streamUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1f/2e/37/1f2e37be-bdd0-d770-6ea4-091011a6aade/mzaf_2360827885900940865.plus.aac.p.m4a",
            quality: .hiRes192,
            bitDepth: 24,
            sampleRate: 192_000,
            codec: "FLAC",
            clashflacId: "clash_hi_res_007",
            youtubeId: "tvTRZJ-4EyI",
            lyricsLrc: """
            [00:00.00]Nobody pray for me, it been that day for me
            [00:04.00]Way (yeah, yeah!)
            [00:06.50]Ayy, I remember syrup sandwiches and crime allowances
            [00:10.00]Finesse a nigga with some counterfeits, but now I'm countin' this
            [00:23.00]Bitch, be humble
            [00:26.00]Sit down
            """
        ),
        AudioTrack(
            id: "track-flac-08",
            title: "deja vu",
            artist: "Olivia Rodrigo",
            album: "SOUR",
            duration: 215,
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273a91c10fe94728291353a0023",
            streamUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/5a/c2/835ac220-f31a-006f-b6a9-2acd29eb60d0/mzaf_13621843495437485054.plus.aac.p.m4a",
            quality: .hiRes96,
            bitDepth: 24,
            sampleRate: 96_000,
            codec: "FLAC",
            clashflacId: "clash_hi_res_008",
            youtubeId: "cii6ruuycQA",
            lyricsLrc: """
            [00:00.00]Car rides to Malibu
            [00:03.50]Strawberry ice cream, one spoon for two
            [00:09.00]And tradin' jackets
            [00:11.80]Laughin' 'bout how small it looks on you
            [00:26.50]So when you gonna tell her that we did that, too?
            """
        )
    ]
}
