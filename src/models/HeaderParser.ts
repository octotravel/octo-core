export class HeaderParser {
  public static getRetryAfterInSeconds(response: Response): number {
    if (!response?.headers) {
      return 0;
    }

    const retryAfterHeader = response.headers.get('retry-after');
    if (retryAfterHeader === null) {
      return 0;
    }

    const retryAfterHeaderNumberValue = Number(retryAfterHeader);
    if (Number.isFinite(retryAfterHeaderNumberValue)) {
      return retryAfterHeaderNumberValue || 0;
    }

    const retryDateMS = Date.parse(retryAfterHeader);
    if (Number.isNaN(retryDateMS)) {
      return 0;
    }

    const deltaMS = retryDateMS - Date.now();
    return deltaMS > 0 ? Math.ceil(deltaMS / 1000) : 0;
  }
}
