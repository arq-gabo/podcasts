export default class extends React.Component {
  render() {
    return (
      <div>
        <h1>Hola Mundo!!!</h1>
        <p>Bienvenidos</p>

        <img src="platzi-logo-small.png" alt="Logo" />

        <style jsx>{`
          h1 {
            color: red;
          }
          :global(p) {
            color: green;
          }
          img {
            max-width: 50%;
            display: block;
            margin: 0 auto;
          }
        `}</style>

        <style jsx global>
          {`
            body {
              background: white;
            }
          `}
        </style>
      </div>
    );
  }
}
