import { useEffect, useState } from 'react';
import { Loader } from './Loader'
import ReactPlayer from 'react-player';
import Request from '../request'; // API static variables


// Pop-up Modal Component
const Modal = ({setIsMovieCardClicked, details /* The fetches info of the movie */, isModalLoading}) => {

    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [trailerVideos, setTrailerVideos] = useState([]);

    useEffect(() => {

        // Fetching the trailer vidoes of the movie
        const fetchVideos = async () => {
            if (!isModalLoading) {
                let id = details.id;

                try {
                    const endpoint = `${Request.apiMovieDiscoverUrl}/movie/${id}/videos`;
                    const response = await fetch(endpoint, Request.API_OPTIONS_GET);

                    if (!response.ok) {
                        throw new Error('Failed to fetch movie videos.')
                    }

                    const data = await response.json();
                    const trailer = [];

                    for (let item of data.results) {
                        if (item.type === "Trailer") {
                            trailer.push(item.key);
                        }
                    }

                    setTrailerVideos(trailer);
                    setIsVideoLoading(false);
                    
                } catch (error) {
                    console.log(`Error fetching movie videos: ${error}`);
                }
            }   
        }
        fetchVideos();
    }, [isModalLoading]);

    // Helper to format the minutes to hours. Example: 2h 34m
    const formatMinutesToHours = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    // Helper to format the number greater than 1000 to something like 1k
    const formatVoteCount = (count) => {

        if (count >= 1000) {
            return `${Math.floor(count / 1000)}k`;
        }

        return count;
    };

    return (
        <>
            { isModalLoading ? (
                <div className='modal' onClick={() => setIsMovieCardClicked(false)}>
                    <div className='modal-card'>
                        <Loader></Loader>
                    </div>
                </div>
            ) : (
                <div className='modal'>
                    <div className='modal-card'>

                        <div className='modal-header'>
                            <h2>{details.title}</h2>
                            <div className='flex flex-col md:flex-row gap-1 md:gap-2'>
                                <div className='modal-bagde'>
                                    <img className='mr-1' src="star.svg" alt="Star Icon" /> <span className='font-semibold text-sm md:text-base'>{parseFloat(details.vote_average).toFixed(1)}</span><span className='font-light text-[#A8B5DB] text-sm md:text-base'>/10 ({formatVoteCount(details.vote_count)})</span>
                                </div>
                                <div className='modal-bagde justify-center max-w-20 md:max-w-lg md:ml-0 ml-auto'>
                                    <img className='size-3 relative top-1 md:top-0 md:size-5 object-contain mr-2' src="high.svg" alt="High Icon" /><span className='font-light text-[#A8B5DB] text-sm md:text-base'>{parseFloat(details.popularity).toFixed(0)}</span>
                                </div>
                            </div>
                        </div>

                        <div className='modal-text'>
                            {details.release_date ? new Date(details.release_date).getFullYear() : 'N/A'} • 
                            {(Array.isArray(details.origin_country) ? details.origin_country.map(item => ` ${item} `) : ' N/A ')}• 
                            {details.runtime ? ` ${formatMinutesToHours(details.runtime)} ` : ' N/A '}
                        </div>

                        <div className="modal-videos">
                            <div className="image">
                                <img 
                                    src={details.poster_path ? `https://image.tmdb.org/t/p/w500/${details.poster_path}` : 'no-movie.png'} 
                                    alt={`${details.title} Poster`}  
                                />
                            </div>
                            {isVideoLoading ? (
                                <div className='videos'>
                                    <Loader></Loader>
                                </div>
                            ) : (
                                trailerVideos.length > 0 ? (
                                    trailerVideos.map((item) => (
                                        <div className='videos' key={item}>
                                            <ReactPlayer  
                                                src={`https://youtu.be/${item}`}
                                                width='100%'
                                                height='100%'
                                            ></ReactPlayer>
                                        </div>
                                    ))
                                ) : (
                                    <img src="no-movie.png" alt="No Movie Image" className="videos" />
                                )
                            )}
                        </div>

                        {/* Genres */}
                        <div className='mt-4 details'>
                            <h3>Genres</h3>
                            <div>
                                {Array.isArray(details.genres) ? details.genres.map((item) => (
                                    <span
                                        key={item.id}
                                        className="badge"
                                    >
                                        {item.name}
                                    </span>
                                )) : 'N/A' }
                            </div>
                        </div>

                        {/* Overview */}
                        <div className='mt-4 details'>
                            <h3>Overview</h3>
                            <p className='overview'>
                                {details.overview}
                            </p>
                        </div>

                    {/* Details Grid */}
                    <div className="details-grid">

                        <div className='details'>
                            <h3>Release date</h3>
                            <p>
                                {details.release_date}
                            </p>
                        </div>

                        <div className='details'>
                            <h3>Countries</h3>
                            <div>
                                {Array.isArray(details.production_countries) ? details.production_countries.map((item) => (
                                    <span
                                        key={item.iso_3166_1}
                                        className="badge"
                                    >
                                        {item.name}
                                    </span>
                                )): 'N/A' }
                            </div>
                        </div>

                        <div className='details'>
                            <h3>Status</h3>
                            <p>
                                {details.status}
                            </p>
                        </div>

                        <div className='details'>
                            <h3>Language</h3>
                            <div>
                                {Array.isArray(details.spoken_languages) ? details.spoken_languages.map((item) => (
                                    <span
                                        key={item.iso_639_1}
                                        className="badge"
                                    >
                                        {item.english_name}
                                    </span>
                                )): 'N/A' }
                            </div>
                        </div>

                        <div className='details'>
                            <h3>Budget</h3>
                            <p>
                                {details.budget}
                            </p>
                        </div>

                        <div className='details'>
                            <h3>Revenue</h3>
                            <p>
                                {details.revenue}
                            </p>
                        </div>

                        <div className='details'>
                            <h3>Tagline</h3>
                            <p>
                                {details.tagline}
                            </p>
                        </div>

                        <div className='details'>
                            <h3>Production Companies</h3>
                            <div>
                                {Array.isArray(details.production_companies) ? details.production_companies.map((item) => (
                                    <span
                                        key={item.id}
                                        className="badge"
                                    >
                                        {item.name}
                                    </span>
                                )): 'N/A' }
                            </div>
                        </div>
                    </div>

                    {/* Visit Homepage Button */}
                    <div className="modal-button">
                        <button
                            onClick={() => setIsMovieCardClicked(false)}
                        >
                            Visit Homepage <img src="arrow.svg" alt="Arrow Icon" />
                        </button>
                    </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default Modal
