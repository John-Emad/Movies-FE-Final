import { Series, SeriesDetails } from './SeriesInterface';
export declare class SeriesService {
    private readonly API_KEY;
    private BASE_URL;
    getPopularSeries(page?: number): Promise<Series[]>;
    getTopRatedSeries(page?: number): Promise<Series[]>;
    getSeriesDetails(id: number): Promise<SeriesDetails>;
}
//# sourceMappingURL=seriesOperations.d.ts.map