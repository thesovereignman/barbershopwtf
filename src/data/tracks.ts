export type Track = {
  id: string
  title: string
  artist: string
  youtubeId: string
}

/** Early-2000s barbershop classics — individual YouTube embeds (saloon.wtf style). */
export const tracks: Track[] = [
  {
    id: '1',
    title: 'Yeah!',
    artist: 'Usher ft. Lil Jon & Ludacris',
    youtubeId: 'GxBSyx85Kp8',
  },
  {
    id: '2',
    title: 'In Da Club',
    artist: '50 Cent',
    youtubeId: '5qm8PH4xAss',
  },
  {
    id: '3',
    title: 'Hot In Herre',
    artist: 'Nelly',
    youtubeId: 'GeZZr_p6vB8',
  },
  {
    id: '4',
    title: 'Dilemma',
    artist: 'Nelly ft. Kelly Rowland',
    youtubeId: '8WYHDfJDPDc',
  },
  {
    id: '5',
    title: 'Family Affair',
    artist: 'Mary J. Blige',
    youtubeId: 'znlFu_lemsU',
  },
  {
    id: '6',
    title: 'Try Again',
    artist: 'Aaliyah',
    youtubeId: 'qTA0RuZoIxM',
  },
  {
    id: '7',
    title: 'Always On Time',
    artist: 'Ja Rule ft. Ashanti',
    youtubeId: '0tcDXJfAFVw',
  },
  {
    id: '8',
    title: 'Foolish',
    artist: 'Ashanti',
    youtubeId: 'gUPrnu3BEU8',
  },
  {
    id: '9',
    title: 'Hey Ma',
    artist: "Cam'ron ft. Juelz Santana, Freekey Zekey & Toya",
    youtubeId: 'm60XKqEEnfg',
  },
  {
    id: '10',
    title: 'Get Low',
    artist: 'Lil Jon & The East Side Boyz ft. Ying Yang Twins',
    youtubeId: 'IYH7_GzP4Tg',
  },
  {
    id: '11',
    title: 'Work It',
    artist: 'Missy Elliott',
    youtubeId: 'cjIvu7e6Wq8',
  },
  {
    id: '12',
    title: 'Hey Ya!',
    artist: 'OutKast',
    youtubeId: 'PWgvGjAhvIw',
  },
  {
    id: '13',
    title: 'Crazy In Love',
    artist: 'Beyoncé ft. Jay-Z',
    youtubeId: 'ViwtNLUqkMY',
  },
  {
    id: '14',
    title: 'Let Me Love You',
    artist: 'Mario',
    youtubeId: 'H64QG4UsrGI',
  },
  {
    id: '15',
    title: '1, 2 Step',
    artist: 'Ciara ft. Missy Elliott',
    youtubeId: 'iBHNgV6_znU',
  },
  {
    id: '16',
    title: 'Tipsy',
    artist: 'J-Kwon',
    youtubeId: 'VwXeN2FsE7w',
  },
  {
    id: '17',
    title: 'Stand Up',
    artist: 'Ludacris ft. Shawnna',
    youtubeId: 'pZG7IK99OvI',
  },
  {
    id: '18',
    title: 'Get Busy',
    artist: 'Sean Paul',
    youtubeId: 'oPQ3o14ksaM',
  },
]

export const PLAYLIST_LINKS = {
  youtube:
    'https://www.youtube.com/playlist?list=PLiy0XOfUv4hGOgrdMw9qfCWMMK07f-P8J',
  /** Public Spotify throwback playlist */
  spotify: 'https://open.spotify.com/playlist/7h9ndhinByPjiFLlfnRZ2Q?si=qhk4ciSpTPyv--oAX514fw',
  mixFallback: 'https://www.youtube.com/watch?v=mOsyIPOUK14',
}

export function coverUrl(youtubeId: string, quality: 'hq' | 'mq' | 'sd' = 'hq') {
  const map = {
    hq: 'hqdefault',
    mq: 'mqdefault',
    sd: 'sddefault',
  } as const
  return `https://i.ytimg.com/vi/${youtubeId}/${map[quality]}.jpg`
}
