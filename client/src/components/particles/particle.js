import Particles from 'react-particles-js';
import person1 from './../../images/Person1.svg';

const particles = function () {
    return <Particles
        params={{
            "particles": {
                "number": {
                    "value": 8,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "line_linked": {
                    "enable": false
                },
                "move": {
                    "speed": 1,
                    "out_mode": "out"
                },
                "shape": {
                    "type": [
                        "image",
                        "circle"
                    ],
                    "image": [
                        {
                            "src": {person1},
                            "height": 20,
                            "width": 23
                        },
                        {
                            "src": "",
                            "height": 20,
                            "width": 20
                        },
                        {
                            "src": "",
                            "height": 20,
                            "width": 20
                        }
                    ]
                },
                "color": {
                    "value": "#CCC"
                },
                "size": {
                    "value": 30,
                    "random": false,
                    "anim": {
                        "enable": true,
                        "speed": 4,
                        "size_min": 10,
                        "sync": false
                    }
                }
            },
            "retina_detect": false
        }} />
}

export default particles;