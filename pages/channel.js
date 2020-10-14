import Layout from "../components/Layout";
import Banner from "../components/Banner";
import PodcastListWithClick from "../components/PodcastListWithClick";
import ChannelGrid from "../components/ChannelGrid";
import Error from "./_error";
import PodcastPlayer from "../components/PodcastPlayer";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openPodcast: null };
  }

  static async getInitialProps({ query, res }) {
    let idChannel = query.id;

    try {
      let [reqChannel, reqSeries, reqAudios] = await Promise.all([
        fetch(`https://api.audioboom.com/channels/${idChannel}`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/child_channels`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/audio_clips`),
      ]);

      if (reqChannel.status >= 400) {
        res.statusCode = reqChannel.status;
        return {
          channel: null,
          audioClips: null,
          series: null,
          statusCode: 404,
        };
      }

      let dataChannel = await reqChannel.json();
      let channel = dataChannel.body.channel;

      let dataAudios = await reqAudios.json();
      let audioClips = dataAudios.body.audio_clips;

      let dataSeries = await reqSeries.json();
      let series = dataSeries.body.channels;

      return { channel, audioClips, series, statusCode: 200 };
    } catch (e) {
      return { channel: null, audioClips: null, series: null, statusCode: 503 };
    }
  }

  openPodcast = (event, podcast) => {
    event.preventDefault();
    this.setState({
      openPodcast: podcast,
    });
  };

  closePodcast = () => {
    event.preventDefault();
    this.setState({
      openPodcast: null,
    });
  };

  render() {
    const { channel, audioClips, series, statusCode } = this.props;

    const { openPodcast } = this.state;

    if (statusCode !== 200) {
      return <Error statusCode={statusCode} />;
    }

    return (
      <Layout title={channel.title}>
        <Banner channel={channel} />

        {openPodcast && (
          <div className="modal">
            <PodcastPlayer clip={openPodcast} onClose={this.closePodcast} />
          </div>
        )}

        <h1>{channel.title}</h1>
        {series.length > 0 && (
          <div>
            <ChannelGrid channels={series} />
          </div>
        )}
        {audioClips.length > 0 && (
          <div>
            <PodcastListWithClick
              audioClips={audioClips}
              onClickPodcast={this.openPodcast}
            />
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

          .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 99999;
            background: black;
          }
        `}</style>
      </Layout>
    );
  }
}
