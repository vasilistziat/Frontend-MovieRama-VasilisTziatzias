import { imageBackdropDefaultUrl, imageDefaultUrl } from 'components/constants';
import { getVideos } from 'requests/movie';
import { Movie, VideosResponse } from 'types/movie';

export const getTrailer = async (movie: Movie) => {
    const response = await getVideos(movie.id);
    if (!response.ok) return false;

    const videosResponse = (await response.json()) as VideosResponse;
    const trailers = videosResponse.results.filter(
        (video) => video.type == 'Trailer'
    );
    if (!!videosResponse.results.length && !!trailers.length) {
        const trailersString: string[] = [];
        trailers.forEach((trailer) => {
            trailersString.push(`
                <div class="responsive-iframe-video">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            `);
        });
        return trailersString.join('');
    } else {
        return 'No trailer found';
    }
};

export const getPoster = (movie: Movie) => {
    return {
        poster: {
            image: `<img src="${getImageSrc(movie.poster_path)}" alt="${
                movie.title
            }" />`,
            src: getImageSrc(movie.poster_path)
        },
        backdrop: {
            image: `<img src="${getImageSrc(movie.backdrop_path, true)}" alt="${
                movie.title
            }" />`,
            src: getImageSrc(movie.backdrop_path, true)
        }
    };
};

export const getImageSrc = (imagePath: string, backdrop: boolean = false) => {
    let src = 'dist/assets/images/no-file-found.jpg';

    if (imagePath)
        src = `${
            backdrop ? imageBackdropDefaultUrl : imageDefaultUrl
        }/${imagePath}`;

    return src;
};
