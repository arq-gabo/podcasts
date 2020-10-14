import "isomorphic-fetch";
import Link from "next/link";

export default class extends React.Component {
  static async getInitialProps({ query }) {
    let id = query.id;
    let fetchClip = await fetch(
      `https://api.audioboom.com/audio_clips/${id}.mp3`
    );
    let clip = (await fetchClip.json()).body.audio_clip;
    return { clip };
  }

  render() {
    const { clip } = this.props;

    return (
      <div>
        <header>Podcasts</header>

        <div className="modal"></div>
      </div>
    );
  }
}
