import { useEffect, useState } from 'react';
import { Loader } from './Loader'
import ReactPlayer from 'react-player';

const Modal = ({setIsMovieCardClicked, details, setMovieInfo, isModalLoading}) => {

    const apiMovieDiscoverUrl = import.meta.env.VITE_TMDB_MOVIE_DISCOVER_URL;
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const API_OPTIONS = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiKey}`
        }
    }

    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [trailerVideos, setTrailerVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            if (!isModalLoading) {
                let id = details.id;
                try {
                    const endpoint = `${apiMovieDiscoverUrl}/movie/${id}/videos`;
                    const response = await fetch(endpoint, API_OPTIONS);

                    if (!response.ok) {
                        throw new Error('Failed to fetch movie videos.')
                    }

                    const data = await response.json();
                    console.log(data);

                    const trailer = [];
                    for (let item of data.results) {
                        if (item.type === "Trailer") {
                            trailer.push(item.key);
                        }
                    }
                    console.log(trailer)

                    setTrailerVideos(trailer);
                    setIsVideoLoading(false);

                    
                } catch (error) {
                    console.log(`Error fetching movie videos: ${error}`);
                }
            }   
        }
        fetchVideos();
    }, [isModalLoading]);

    const formatMinutesToHours = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    // Helper to format vote_count
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
                        <div className='flex justify-between items-center'>
                            <h2 className='text-2xl md:text-4xl font-semibold max-w-44 md:max-w-none'>{details.title}</h2>
                            <div className='flex flex-col md:flex-row gap-1 md:gap-2'>
                                <div className='bg-[#221F3D] px-2 py-1 md:px-4 md:py-2 rounded-md flex text-white'>
                                    <img className='size-3 relative top-1 md:top-0 md:size-5 object-contain mr-1' src="star.svg" alt="Star Icon" /> <span className='font-semibold text-sm md:text-base'>{parseFloat(details.vote_average).toFixed(1)}</span><span className='font-light text-[#A8B5DB] text-sm md:text-base'>/10 ({formatVoteCount(details.vote_count)})</span>
                                </div>
                                <div className='bg-[#221F3D] px-2 py-1 md:px-4 md:py-2 rounded-md flex justify-center text-white max-w-20 md:max-w-lg md:ml-0 ml-auto'>
                                    <img className='size-3 relative top-1 md:top-0 md:size-5 object-contain mr-2' src="high.svg" alt="High Icon" /><span className='font-light text-[#A8B5DB] text-sm md:text-base'>{parseFloat(details.popularity).toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                        <div className='text-[#A8B5DB] font-light text-base md:text-lg mt-2 md:mt-4'>
                            {details.release_date ? new Date(details.release_date).getFullYear() : 'N/A'} • 
                            {(Array.isArray(details.origin_country) ? details.origin_country.map(item => ` ${item} `) : ' N/A ')}• 
                            {details.runtime ? ` ${formatMinutesToHours(details.runtime)} ` : ' N/A '}
                        </div>
                        <div className="flex snap-x snap-mandatory overflow-x-auto space-x-4 mt-4">
                            <div className="snap-center shrink-0">
                                <img 
                                    className='rounded-lg h-[241px] w-[155px] md:h-[441px] md:w-[302px]'
                                    src={details.poster_path ? `https://image.tmdb.org/t/p/w500/${details.poster_path}` : 'no-movie.png'} 
                                    alt={`${details.title} Poster`}  
                                />
                            </div>
                            {isVideoLoading ? (
                                <div className='flex justify-center items-center h-[241px] w-[318px] md:h-[441px] md:w-[772px] snap-center shrink-0'>
                                    <Loader></Loader>
                                </div>
                            ) : (
                                trailerVideos.length > 0 ? (
                                    trailerVideos.map((item) => (
                                        <div className='rounded-lg overflow-hidden h-[241px] w-[318px] md:h-[441px] md:w-[772px] snap-center shrink-0'>
                                            <ReactPlayer  
                                                src={`https://youtu.be/${item}`}
                                                width='100%'
                                                height='100%'
                                            ></ReactPlayer>
                                        </div>
                                    ))
                                ) : (
                                    <img src="no-movie.png" alt="No Movie Image" className="rounded-lg h-[241px] w-[318px] md:h-[441px] md:w-[772px] snap-center shrink-0" />
                                )
                            )}
                        </div>

                        {/* Genres */}
                        <div className='mt-4'>
                            <h3 className="text-[#A8B5DB] font-light text-base md:text-lg mb-2">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(details.genres) ? details.genres.map((item) => (
                                    <span
                                        key={item.id}
                                        className="bg-[#221F3D] text-white font-semibold px-3 py-1 rounded-lg text-sm md:text-base"
                                    >
                                        {item.name}
                                    </span>
                                )) : 'N/A' }
                            </div>
                        </div>

                    {/* Overview */}
                    <div className='mt-4'>
                        <h3 className="text-[#A8B5DB] font-light text-base md:text-lg mb-2">Overview</h3>
                        <p className="text-white font-light text-sm md:text-base">
                            {details.overview}
                        </p>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mt-4">
                        <div>
                            <h3 className="text-[#A8B5DB] font-light text-base md:text-lg mb-2">Release date</h3>
                            <p className="text-[#D6C7FF] text-sm md:text-base font-semibold">
                                {details.release_date}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[#A8B5DB] font-light text-base md:text-lg mb-2">Countries</h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(details.production_countries) ? details.production_countries.map((item) => (
                                    <span
                                        key={item.iso_3166_1}
                                        className="bg-[#221F3D] text-white font-semibold px-3 py-1 rounded-lg text-sm md:text-base"
                                    >
                                        {item.name}
                                    </span>
                                )): 'N/A' }
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[#A8B5DB] font-light text-base md:text-lg mb-2">Status</h3>
                            <p className="text-[#D6C7FF] text-sm md:text-base font-semibold">
                                {details.status}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[#A8B5DB] font-light text-base md:text-lg mb-2">Language</h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(details.spoken_languages) ? details.spoken_languages.map((item) => (
                                    <span
                                        key={item.iso_639_1}
                                        className="bg-[#221F3D] text-white font-semibold px-3 py-1 rounded-lg text-sm md:text-base"
                                    >
                                        {item.english_name}
                                    </span>
                                )): 'N/A' }
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[#A8B5DB] font-light text-base md:text-lg mb-2">Budget</h3>
                            <p className="text-[#D6C7FF] text-sm md:text-base font-semibold">
                                {details.budget}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[#A8B5DB] font-light text-base md:text-lg mb-2">Revenue</h3>
                            <p className="text-[#D6C7FF] text-sm md:text-base font-semibold">
                                {details.revenue}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[#A8B5DB] font-light text-base md:text-lg mb-2">Tagline</h3>
                            <p className="text-[#D6C7FF] text-sm md:text-base font-semibold">
                                {details.tagline}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[#A8B5DB] font-light text-base md:text-lg mb-2">Production Companies</h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(details.production_companies) ? details.production_companies.map((item) => (
                                    <span
                                        key={item.id}
                                        className="bg-[#221F3D] text-white font-semibold px-3 py-1 rounded-lg text-sm md:text-base"
                                    >
                                        {item.name}
                                    </span>
                                )): 'N/A' }
                            </div>
                        </div>
                    </div>

                    {/* Visit Homepage Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setIsMovieCardClicked(false)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-400 to-purple-500 px-4 py-2 rounded-lg font-medium text-base text-black hover:opacity-90 transition"
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
