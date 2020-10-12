import Layout from "../components/Layout";
import Banner from "../components/Banner";
import PodcastList from "../components/PodcastList";
import SeriesList from "../components/SeriesList";

export default class extends React.Component {
  static async getInitialProps({ query }) {
    let idChannel = query.id;

    let [reqChannel, reqSeries, reqAudios] = await Promise.all([
      fetch(`https://api.audioboom.com/channels/${idChannel}`),
      fetch(`https://api.audioboom.com/channels/${idChannel}/child_channels`),
      fetch(`https://api.audioboom.com/channels/${idChannel}/audio_clips`),
    ]);

    let dataChannel = await reqChannel.json();
    let channel = dataChannel.body.channel;

    let dataAudios = await reqAudios.json();
    let audioClips = dataAudios.body.audio_clips;

    let dataSeries = await reqSeries.json();
    let series = dataSeries.body.channels;

    return { channel, audioClips, series };
  }

  render() {
    const { channel, audioClips, series } = this.props;

    return (
      <Layout title={channel.title}>
        <Banner channel={channel} />
        <h1>{channel.title}</h1>
        {series.length > 0 && (
          <div>
            <SeriesList series={series} />
          </div>
        )}
        {audioClips.length > 0 && (
          <div>
            <PodcastList audioClips={audioClips} />
          </div>
        )}

        <style jsx global>{`
          body {
            margin: 0;
            font-family: system-ui;
            background: white;
          }
          h1 {
            font-weight: 600;
            padding: 15px;
          }
          h2 {
            padding: 5px;
            font-size: 0.9em;
            font-weight: 600;
            margin: 0;
            text-align: center;
          }
        `}</style>
      </Layout>
    );
  }
}
