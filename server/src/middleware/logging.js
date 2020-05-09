import { statSaver } from './../models/genericModel';

export async function statCollector(req, res, next) {
    statSaver(req.get('user-agent'), req.headers['x-real-ip'] || req.connection.remoteAddress, req.path);
    return next();
}