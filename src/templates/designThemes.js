export const designThemes = [
  {
    id: 'violet',
    name: 'Violet dusk',
    gradient: 'linear-gradient(125deg, #262b3c, #64578c)',
    start: '#262b3c',
    end: '#64578c',
  },
  {
    id: 'hot-pink',
    name: 'Hot pink',
    gradient: 'linear-gradient(125deg, #702248, #f04e82)',
    start: '#702248',
    end: '#f04e82',
  },
  {
    id: 'green',
    name: 'Garden',
    gradient: 'linear-gradient(125deg, #145447, #63ad78)',
    start: '#145447',
    end: '#63ad78',
  },
  {
    id: 'blue-violet',
    name: 'Blue violet',
    gradient: 'linear-gradient(125deg, #174b81, #7659d8)',
    start: '#174b81',
    end: '#7659d8',
  },
  {
    id: 'golden',
    name: 'Golden hour',
    gradient: 'linear-gradient(125deg, #704b16, #dfab4e)',
    start: '#704b16',
    end: '#dfab4e',
  },
]

export function getDesignTheme(id) {
  return designThemes.find((designTheme) => designTheme.id === id) || designThemes[0]
}
