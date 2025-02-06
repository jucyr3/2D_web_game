import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientHttpRequestsService } from './client-http-requests.service';
import { environment } from 'src/environments/environment';
import { Map } from '@common/map';

describe('ClientHttpRequestsService', () => {
  let service: ClientHttpRequestsService;
  let httpMock: HttpTestingController;

  const mockMap: Map = {
    id: 1,
    name: 'Test Map',
    size: 10,
    isVisible: true,
    description: 'Test Description',
    gameMode: 'Classic',
    tileMatrix: [],
    lastModified: new Date(),
    previewImage: 'base64string'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientHttpRequestsService]
    });
    service = TestBed.inject(ClientHttpRequestsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get maps', () => {
    service.getMaps().subscribe(maps => {
      expect(maps).toEqual([mockMap]);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/maps`);
    expect(req.request.method).toBe('GET');
    req.flush([mockMap]);
  });

  it('should save map', () => {
    service.saveMapToServer(mockMap).subscribe(map => {
      expect(map).toEqual(mockMap);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/maps`);
    expect(req.request.method).toBe('POST');
    req.flush(mockMap);
  });

  it('should get maps by visibility', () => {
    service.getAllMapsByVisibility().subscribe(maps => {
      expect(maps).toEqual([mockMap]);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/maps/visibility/isVisible`);
    expect(req.request.method).toBe('GET');
    req.flush([mockMap]);
  });

  it('should update map visibility', () => {
    service.updateMapVisibility(1, true).subscribe(map => {
      expect(map).toEqual(mockMap);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/maps/1/isVisible`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ isVisible: true });
    req.flush(mockMap);
  });

  it('should save map image', () => {
    service.saveMapImageOnServer(1, 'base64image').subscribe(map => {
      expect(map).toEqual(mockMap);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/maps/1/previewImage`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ previewImage: 'base64image' });
    req.flush(mockMap);
  });

  it('should delete map', () => {
    service.deleteMap(1).subscribe();

    const req = httpMock.expectOne(`${environment.serverUrl}/maps/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should load map by id', () => {
    service.loadMapById(1).subscribe(map => {
      expect(map).toEqual(mockMap);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/maps/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMap);
  });

  it('should handle non-array response in getMaps', () => {
    service.getMaps().subscribe(maps => {
      expect(maps).toEqual([mockMap]);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/maps`);
    req.flush(mockMap);
  });

  it('should handle error in saveMapToServer', () => {
    service.saveMapToServer(mockMap).subscribe({
      error: error => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/maps`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});