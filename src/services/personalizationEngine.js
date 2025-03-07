'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
        __createBinding(exports, m, p);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.DEFAULT_PREFERENCES =
  exports.userPersonalizationEngine =
  exports.UserPersonalizationEngine =
  exports.CHARACTER_ARCHETYPES =
  exports.CHARACTER_TRAITS =
  exports.THEME_ELEMENTS =
  exports.THEME_DESCRIPTIONS =
    void 0;
var logger_1 = require('../utils/logger');
var uuid_1 = require('uuid');
var redis = require('../utils/redis');

var fallback_generator_1 = require('../utils/fallback-generator');
var error_handlers_1 = require('../utils/error-handlers');
var DEFAULT_PREFERENCES = {
  userId: null,
  preferredThemes: ['adventure', 'educational'],
  generatedStoryCount: 0,
  learningInterests: [],
  ageGroup: '6-8',
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    push: false,
    frequency: 'weekly',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};
exports.DEFAULT_PREFERENCES = DEFAULT_PREFERENCES;
// Define theme descriptions for more detailed story generation
exports.THEME_DESCRIPTIONS = {
  adventure: 'exciting journeys, exploration, and discovering new places',
  fantasy: 'magical worlds, enchanted creatures, and extraordinary powers',
  science: 'scientific discoveries, experiments, and understanding how things work',
  nature: 'the natural world, animals, plants, and environmental awareness',
  friendship: 'building relationships, working together, and supporting others',
  educational: 'learning new facts, developing skills, and gaining knowledge',
  courage: 'bravery in the face of challenges, overcoming fears, and standing up for what is right',
  kindness: 'compassion, helping others, and making a positive difference',
  curiosity: 'asking questions, seeking answers, and exploring the unknown',
  creativity: 'imagination, artistic expression, and innovative thinking',
};
// Define theme-specific story elements
exports.THEME_ELEMENTS = {
  adventure: {
    settings: ['mysterious island', 'ancient ruins', 'dense jungle', 'mountain peak'],
    characters: ['brave explorer', 'treasure hunter', 'wilderness guide', 'ship captain'],
    challenges: ['crossing a dangerous river', 'finding a hidden map', 'escaping a storm'],
  },
  fantasy: {
    settings: ['enchanted forest', 'magical kingdom', 'cloud castle', 'underwater city'],
    characters: ['wizard', 'fairy', 'dragon', 'talking animal', 'magical creature'],
    challenges: ['breaking a spell', 'finding a magical artifact', 'solving a magical riddle'],
  },
  science: {
    settings: [
      'laboratory',
      'space station',
      'underwater research facility',
      "inventor's workshop",
    ],
    characters: ['scientist', 'robot', 'astronaut', 'inventor', 'time traveler'],
    challenges: ['completing an experiment', 'making a discovery', 'building a machine'],
  },
  nature: {
    settings: ['forest', 'ocean', 'mountain', 'desert', 'rainforest'],
    characters: ['wildlife ranger', 'talking animal', 'tree spirit', 'nature guardian'],
    challenges: ['protecting endangered animals', 'planting trees', 'cleaning up pollution'],
  },
  friendship: {
    settings: ['school', 'neighborhood', 'treehouse', 'playground', 'summer camp'],
    characters: ['new friend', 'best friend', 'neighbor', 'classmate', 'teammate'],
    challenges: ['making a new friend', 'resolving a misunderstanding', 'working together'],
  },
  educational: {
    settings: ['museum', 'library', 'historical site', 'classroom', 'learning center'],
    characters: ['teacher', 'librarian', 'historical figure', 'talking book', 'wise elder'],
    challenges: ['solving a puzzle', 'finding information', 'learning a new skill'],
  },
  courage: {
    settings: ['dark cave', 'stormy sea', 'tall mountain', 'unfamiliar city'],
    characters: ['hero', 'brave animal', 'guardian', 'mentor', 'someone in need'],
    challenges: ['facing a fear', 'standing up to a bully', 'trying something new'],
  },
  kindness: {
    settings: ['community center', 'animal shelter', 'hospital', 'elderly home', 'neighborhood'],
    characters: ['someone in need', 'grateful recipient', 'community helper', 'kind stranger'],
    challenges: ['helping someone in need', 'sharing limited resources', 'showing compassion'],
  },
  curiosity: {
    settings: ['mysterious door', 'strange garden', 'abandoned house', 'hidden passage'],
    characters: ['detective', 'explorer', 'scientist', 'archaeologist', 'curious animal'],
    challenges: ['solving a mystery', 'discovering a secret', 'finding answers to questions'],
  },
  creativity: {
    settings: ['art studio', 'music room', 'theater stage', 'imagination land', 'blank canvas'],
    characters: ['artist', 'musician', 'storyteller', 'inventor', 'dreamer'],
    challenges: [
      'creating something new',
      'expressing feelings through art',
      'imagining solutions',
    ],
  },
};
// Define character traits for more detailed character customization
exports.CHARACTER_TRAITS = {
  personality: [
    'brave',
    'curious',
    'kind',
    'clever',
    'creative',
    'funny',
    'adventurous',
    'thoughtful',
    'determined',
    'gentle',
    'energetic',
    'patient',
    'helpful',
  ],
  appearance: [
    'curly hair',
    'straight hair',
    'glasses',
    'bright eyes',
    'freckles',
    'tall',
    'small',
    'athletic',
    'colorful clothes',
    'favorite hat',
  ],
  skills: [
    'good at sports',
    'loves to read',
    'great at puzzles',
    'artistic',
    'musical',
    'good with animals',
    'great storyteller',
    'fast runner',
    'good listener',
  ],
};
// Define character archetypes for supporting characters
exports.CHARACTER_ARCHETYPES = [
  'wise mentor',
  'loyal friend',
  'mischievous sidekick',
  'protective guardian',
  'curious explorer',
  'skilled teacher',
  'mysterious stranger',
  'playful companion',
  'brave hero',
  'clever inventor',
  'kind healer',
  'magical guide',
];
var UserPersonalizationEngine = /** @class */ (function () {
  function UserPersonalizationEngine(userId) {
    this.userId = undefined;
    this.isServerSide = typeof window === 'undefined';
    this.userId = userId;
    logger_1.logger.info('UserPersonalizationEngine initialized', { userId: userId });
  }
  UserPersonalizationEngine.prototype.isValidPreferences = function (preferences) {
    if (!preferences || typeof preferences !== 'object') return false;
    var p = preferences;
    return (
      Array.isArray(p.preferredThemes) &&
      typeof p.generatedStoryCount === 'number' &&
      Array.isArray(p.learningInterests) &&
      typeof p.theme === 'string' &&
      typeof p.language === 'string'
    );
  };
  UserPersonalizationEngine.prototype.setUserId = function (userId) {
    this.userId = userId;
  };
  UserPersonalizationEngine.prototype.getUserId = function () {
    return this.userId;
  };
  UserPersonalizationEngine.prototype.getUserPreferences = function () {
    return __awaiter(this, void 0, void 0, function () {
      var kvKey, storedPreferences, kvError_1, storedPreferences, parsed, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.userId) return [2 /*return*/, DEFAULT_PREFERENCES];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 6, , 7]);
            if (!(this.isServerSide && this.userId !== 'default-user')) return [3 /*break*/, 5];
            _a.label = 2;
          case 2:
            _a.trys.push([2, 4, , 5]);
            kvKey = 'user:preferences:'.concat(this.userId);
            return [4 /*yield*/, serverRedisCall('get', [kvKey])];
          case 3:
            storedPreferences = _a.sent();
            if (storedPreferences && typeof storedPreferences === 'object') {
              logger_1.logger.info('Retrieved user preferences from Redis store', {
                userId: this.userId,
              });
              return [2 /*return*/, __assign(__assign({}, DEFAULT_PREFERENCES), storedPreferences)];
            }
            return [3 /*break*/, 5];
          case 4:
            kvError_1 = _a.sent();
            logger_1.logger.error('Error fetching user preferences from Redis:', {
              error: kvError_1,
            });
            return [3 /*break*/, 5];
          case 5:
            // Client-side storage fallback
            if (typeof window !== 'undefined') {
              storedPreferences = localStorage.getItem('preferences:'.concat(this.userId));
              if (storedPreferences) {
                parsed = JSON.parse(storedPreferences);
                if (!this.isValidPreferences(parsed)) {
                  logger_1.logger.error('Invalid preferences format in localStorage');
                  return [2 /*return*/, DEFAULT_PREFERENCES];
                }
                return [2 /*return*/, __assign(__assign({}, DEFAULT_PREFERENCES), parsed)];
              }
            }
            return [2 /*return*/, DEFAULT_PREFERENCES];
          case 6:
            error_1 = _a.sent();
            logger_1.logger.error('Error fetching user preferences:', { error: error_1 });
            return [2 /*return*/, DEFAULT_PREFERENCES];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  UserPersonalizationEngine.prototype.updateUserPreferences = function (newPreferences) {
    return __awaiter(this, void 0, void 0, function () {
      var currentPreferences, updatedPreferences, kvKey, kvError_2, error_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.userId) return [2 /*return*/, false];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 7, , 8]);
            return [4 /*yield*/, this.getUserPreferences()];
          case 2:
            currentPreferences = _a.sent();
            updatedPreferences = __assign(
              __assign(__assign({}, currentPreferences), newPreferences),
              { updatedAt: new Date() }
            );
            if (!(this.isServerSide && this.userId !== 'default-user')) return [3 /*break*/, 6];
            _a.label = 3;
          case 3:
            _a.trys.push([3, 5, , 6]);
            kvKey = 'user:preferences:'.concat(this.userId);
            return [4 /*yield*/, serverRedisCall('set', [kvKey, updatedPreferences])];
          case 4:
            _a.sent();
            logger_1.logger.info('Updated user preferences in Redis store', {
              userId: this.userId,
            });
            return [2 /*return*/, true];
          case 5:
            kvError_2 = _a.sent();
            logger_1.logger.error('Error updating user preferences in Redis:', {
              error: kvError_2,
            });
            return [3 /*break*/, 6];
          case 6:
            // Client-side storage fallback
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                'preferences:'.concat(this.userId),
                JSON.stringify(updatedPreferences)
              );
              return [2 /*return*/, true];
            }
            return [2 /*return*/, false];
          case 7:
            error_2 = _a.sent();
            logger_1.logger.error('Error updating user preferences:', { error: error_2 });
            return [2 /*return*/, false];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  };
  UserPersonalizationEngine.prototype.incrementStoryCount = function () {
    return __awaiter(this, void 0, void 0, function () {
      var userData, currentStoryCount, newStoryCount, error_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.userId || this.userId === 'default-user') return [2 /*return*/, false];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            return [4 /*yield*/, redis.hgetall('user:'.concat(this.userId))];
          case 2:
            userData = _a.sent();
            if (!userData) {
              logger_1.logger.warn('No user data found when incrementing story count', {
                userId: this.userId,
              });
              return [2 /*return*/, false];
            }
            currentStoryCount = parseInt(userData.storiesGenerated || '0', 10);
            newStoryCount = currentStoryCount + 1;
            // Update story count in database
            return [
              4 /*yield*/,
              redis.hset('user:'.concat(this.userId), {
                storiesGenerated: newStoryCount,
                lastStoryGeneratedAt: new Date().toISOString(),
              }),
            ];
          case 3:
            // Update story count in database
            _a.sent();
            logger_1.logger.info('Successfully incremented story count', {
              userId: this.userId,
              previousCount: currentStoryCount,
              newCount: newStoryCount,
            });
            return [2 /*return*/, true];
          case 4:
            error_3 = _a.sent();
            logger_1.logger.error(
              'Error incrementing story count',
              (0, error_handlers_1.serializeError)(error_3)
            );
            return [2 /*return*/, false];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Generate a unique ID for a story
   *
   * This method generates a unique identifier for each story using UUID v4.
   * It's marked as deprecated since uuidv4() should be used directly instead.
   *
   * @returns Unique ID string
   * @deprecated Use uuidv4() directly instead
   */
  UserPersonalizationEngine.prototype.generateUniqueId = function () {
    return (0, uuid_1.v4)();
  };
  /**
   * Generate a cache key for a story
   *
   * This method creates a deterministic cache key based on the story input parameters.
   * The key format is: story:{childName}:{sortedInterests}:{theme}:{gender}
   *
   * @param input Story generation input parameters
   * @returns Cache key string
   */
  UserPersonalizationEngine.prototype.generateCacheKey = function (input) {
    var childName = input.childName,
      _a = input.interests,
      interests = _a === void 0 ? [] : _a,
      theme = input.theme,
      gender = input.gender;
    // Sort interests for consistent cache keys regardless of order
    var sortedInterests = __spreadArray([], interests, true).sort().join(',');
    // Create a deterministic cache key
    return 'story:'
      .concat(childName, ':')
      .concat(sortedInterests, ':')
      .concat(theme, ':')
      .concat(gender);
  };
  /**
   * Generate a story using the Gemini API
   *
   * This method generates a story using the Gemini API, with caching and fallback mechanisms.
   * It includes comprehensive error handling, circuit breaking, and detailed logging.
   *
   * @param input Story generation input parameters
   * @returns Generated story content
   */
  UserPersonalizationEngine.prototype.generateStory = function (input) {
    return __awaiter(this, void 0, void 0, function () {
      var cacheKey, cachedStory, cacheError_1, apiCallFunction, fallbackFunction, error_4;
      var _this = this;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            logger_1.logger.info('Starting story generation', {
              childName: input.childName,
              theme: input.theme,
              gender: input.gender,
              interestsCount:
                ((_a = input.interests) === null || _a === void 0 ? void 0 : _a.length) || 0,
            });
            cacheKey = this.generateCacheKey(input);
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, , 4]);
            return [4 /*yield*/, redis.get(cacheKey)];
          case 2:
            cachedStory = _b.sent();
            if (cachedStory) {
              logger_1.logger.info('Using cached story', {
                cacheKey: cacheKey,
                userId: this.userId,
                contentLength: cachedStory.length,
              });
              return [2 /*return*/, cachedStory];
            }
            logger_1.logger.info('No cached story found, generating new story', {
              cacheKey: cacheKey,
              userId: this.userId,
            });
            return [3 /*break*/, 4];
          case 3:
            cacheError_1 = _b.sent();
            logger_1.logger.warn(
              'Error checking story cache',
              (0, error_handlers_1.serializeError)(cacheError_1)
            );
            return [3 /*break*/, 4];
          case 4:
            apiCallFunction = function () {
              return __awaiter(_this, void 0, void 0, function () {
                var storyContent, cacheTTL, cacheError_2, error_5;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      _a.trys.push([0, 7, , 8]);
                      return [4 /*yield*/, this.callGeminiEndpoint(input)];
                    case 1:
                      storyContent = _a.sent();
                      _a.label = 2;
                    case 2:
                      _a.trys.push([2, 4, , 5]);
                      cacheTTL = 60 * 60 * 24;
                      return [4 /*yield*/, redis.set(cacheKey, storyContent, { ex: cacheTTL })];
                    case 3:
                      _a.sent();
                      logger_1.logger.info('Successfully cached story', {
                        cacheKey: cacheKey,
                        userId: this.userId,
                        contentLength: storyContent.length,
                        cacheTTL: cacheTTL,
                      });
                      return [3 /*break*/, 5];
                    case 4:
                      cacheError_2 = _a.sent();
                      logger_1.logger.warn(
                        'Error caching story',
                        (0, error_handlers_1.serializeError)(cacheError_2)
                      );
                      return [3 /*break*/, 5];
                    case 5:
                      // Increment the user's story count
                      return [4 /*yield*/, this.incrementStoryCount()];
                    case 6:
                      // Increment the user's story count
                      _a.sent();
                      return [2 /*return*/, storyContent];
                    case 7:
                      error_5 = _a.sent();
                      logger_1.logger.error(
                        'Error generating story with Gemini API',
                        (0, error_handlers_1.serializeError)(error_5)
                      );
                      throw error_5;
                    case 8:
                      return [2 /*return*/];
                  }
                });
              });
            };
            fallbackFunction = function () {
              logger_1.logger.warn('Using fallback story generation due to API failure', {
                circuitState: error_handlers_1.geminiCircuitBreaker.status.stats,
                metrics: error_handlers_1.geminiCircuitBreaker.stats,
              });
              return (0, fallback_generator_1.generateFallbackStory)(input);
            };
            _b.label = 5;
          case 5:
            _b.trys.push([5, 7, , 8]);
            return [4 /*yield*/, error_handlers_1.geminiCircuitBreaker.fire(apiCallFunction)];
          case 6:
            // Use the circuit breaker to make the API call
            return [2 /*return*/, _b.sent()];
          case 7:
            error_4 = _b.sent();
            // This catch block handles any errors that might occur in the circuit breaker itself
            logger_1.logger.error(
              'Circuit breaker caught error',
              (0, error_handlers_1.serializeError)(error_4)
            );
            return [2 /*return*/, fallbackFunction()];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Generate personalized story using Gemini API endpoint
   *
   * This method generates a story using the Gemini API, with caching and fallback mechanisms.
   * It includes comprehensive error handling, circuit breaking, and detailed logging.
   *
   * @param input Story generation input parameters
   * @returns Generated story content
   */
  UserPersonalizationEngine.prototype.generatePersonalizedStory = function (input, userPrefs) {
    console.log('generatePersonalizedStory called');
    console.log('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL);
    console.log('UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN);
    return __awaiter(this, void 0, void 0, function () {
      var storyId,
        pronouns,
        _a,
        pronoun,
        possessivePronoun,
        cacheKey,
        cachedStory,
        titleMatch,
        title,
        content,
        apiCallFunction,
        fallbackFunction,
        error_6,
        error_7,
        fallbackContent;
      var _this = this;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            logger_1.logger.info('Starting personalized story generation', {
              input: input,
              userPrefs: userPrefs
                ? __assign(__assign({}, userPrefs), {
                    userId: userPrefs.userId ? 'REDACTED' : null,
                  })
                : undefined,
            });
            storyId = this.generateUniqueId();
            pronouns =
              input.gender === 'female' || input.gender === 'girl'
                ? 'she/her'
                : input.gender === 'boy' || input.gender === 'male'
                  ? 'he/him'
                  : 'they/them';
            (_a = pronouns.split('/')), (pronoun = _a[0]), (possessivePronoun = _a[1]);
            cacheKey = this.generateCacheKey(input);
            _b.label = 1;
          case 1:
            _b.trys.push([1, 7, , 8]);
            return [4 /*yield*/, redis.get(cacheKey)];
          case 2:
            cachedStory = _b.sent();
            if (cachedStory) {
              logger_1.logger.info('Using cached story', {
                cacheKey: cacheKey,
                userId: this.userId,
                contentLength: cachedStory.length,
              });
              titleMatch = cachedStory.match(/^#\s*(.+?)(?:\n|$)/m);
              title = titleMatch ? titleMatch[1].trim() : 'Untitled Story';
              content = cachedStory.replace(/^#\s*(.+?)(?:\n|$)/m, '').trim();
              return [
                2 /*return*/,
                {
                  id: storyId,
                  title: title,
                  content: content,
                  theme: input.theme,
                  createdAt: new Date().toISOString(),
                  input: input,
                  metadata: {
                    pronouns: pronoun,
                    possessivePronouns: possessivePronoun,
                    generatedAt: new Date().toISOString(),
                    wordCount: content.split(/\s+/).length,
                    readingTime: Math.ceil(content.split(/\s+/).length / 200), // Approx. 200 words per minute
                  },
                  userId: this.userId,
                  pronouns: pronoun,
                  possessivePronouns: possessivePronoun,
                  generatedAt: new Date().toISOString(),
                },
              ];
            }
            // No cached story found, generate a new one
            logger_1.logger.info('No cached story found, generating new story', {
              cacheKey: cacheKey,
              userId: this.userId,
            });
            apiCallFunction = function () {
              return __awaiter(_this, void 0, void 0, function () {
                var themeDescription,
                  themeElements,
                  prefs,
                  _a,
                  prompt_1,
                  response,
                  errorData,
                  data,
                  storyContent,
                  titleMatch,
                  title,
                  content,
                  cacheTTL,
                  error_8;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                  switch (_f.label) {
                    case 0:
                      _f.trys.push([0, 9, , 10]);
                      themeDescription = exports.THEME_DESCRIPTIONS[input.theme] || input.theme;
                      themeElements = exports.THEME_ELEMENTS[input.theme];
                      _a = userPrefs;
                      if (_a) return [3 /*break*/, 2];
                      return [4 /*yield*/, this.getUserPreferences()];
                    case 1:
                      _a = _f.sent();
                      _f.label = 2;
                    case 2:
                      prefs = _a;
                      prompt_1 = '\n            Create a bedtime story for a child named '
                        .concat(input.childName, ' who uses ')
                        .concat(pronouns, ' pronouns.\n\n            The story should be about ')
                        .concat(themeDescription, '.\n\n            ')
                        .concat(
                          ((_b = input.interests) === null || _b === void 0 ? void 0 : _b.length)
                            ? 'Include these interests: '.concat(input.interests.join(', '), '.')
                            : '',
                          '\n            '
                        )
                        .concat(
                          (
                            (_c = prefs.learningInterests) === null || _c === void 0
                              ? void 0
                              : _c.length
                          )
                            ? 'The child is also interested in learning about: '.concat(
                                prefs.learningInterests.join(', '),
                                '.'
                              )
                            : '',
                          '\n\n            '
                        )
                        .concat(
                          themeElements
                            ? '\n            You can use these settings: '
                                .concat(
                                  themeElements.settings.join(', '),
                                  '.\n            You can include these character types: '
                                )
                                .concat(
                                  themeElements.characters.join(', '),
                                  '.\n            You can incorporate these challenges: '
                                )
                                .concat(themeElements.challenges.join(', '), '.\n            ')
                            : '',
                          '\n            \n            '
                        )
                        .concat(
                          (
                            (_d = input.favoriteCharacters) === null || _d === void 0
                              ? void 0
                              : _d.length
                          )
                            ? 'Try to include references to these favorite characters: '.concat(
                                input.favoriteCharacters.join(', '),
                                '.'
                              )
                            : '',
                          '\n            '
                        )
                        .concat(
                          (
                            (_e = input.mostLikedCharacterTypes) === null || _e === void 0
                              ? void 0
                              : _e.length
                          )
                            ? 'The child enjoys characters that are: '.concat(
                                input.mostLikedCharacterTypes.join(', '),
                                '.'
                              )
                            : '',
                          '\n            \n            Make the story age-appropriate for a '
                        )
                        .concat(
                          prefs.ageGroup || '6-8',
                          ' year old child.\n            The story should be engaging, with a positive message.\n\n            Format the story with a title at the beginning using a single # markdown heading.\n            Keep the story under 500 words.\n          '
                        );
                      return [
                        4 /*yield*/,
                        fetch('/api/gemini', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            type: 'story',
                            childName: input.childName,
                            gender: input.gender,
                            theme: input.theme,
                            interests: input.interests,
                            prompt: prompt_1,
                          }),
                        }),
                      ];
                    case 3:
                      response = _f.sent();
                      if (!!response.ok) return [3 /*break*/, 5];
                      return [4 /*yield*/, response.json()];
                    case 4:
                      errorData = _f.sent();
                      throw new Error(
                        'Gemini API error: '.concat(errorData.error || response.statusText)
                      );
                    case 5:
                      return [4 /*yield*/, response.json()];
                    case 6:
                      data = _f.sent();
                      storyContent = data.content;
                      titleMatch = storyContent.match(/^#\s*(.+?)(?:\n|$)/m);
                      title = titleMatch ? titleMatch[1].trim() : 'Untitled Story';
                      content = storyContent.replace(/^#\s*(.+?)(?:\n|$)/m, '').trim();
                      cacheTTL = 60 * 60 * 24;
                      return [4 /*yield*/, redis.set(cacheKey, storyContent, { ex: cacheTTL })];
                    case 7:
                      _f.sent();
                      logger_1.logger.info('Successfully generated and cached story', {
                        userId: this.userId,
                        title: title,
                        contentLength: content.length,
                        cacheTTL: cacheTTL,
                      });
                      // Increment the user's story count
                      return [4 /*yield*/, this.incrementStoryCount()];
                    case 8:
                      // Increment the user's story count
                      _f.sent();
                      // Create and return the story object
                      return [
                        2 /*return*/,
                        {
                          id: storyId,
                          title: title,
                          content: content,
                          theme: input.theme,
                          createdAt: new Date().toISOString(),
                          input: input,
                          metadata: {
                            pronouns: pronoun,
                            possessivePronouns: possessivePronoun,
                            generatedAt: new Date().toISOString(),
                            wordCount: content.split(/\s+/).length,
                            readingTime: Math.ceil(content.split(/\s+/).length / 200), // Approx. 200 words per minute
                          },
                          userId: this.userId,
                          pronouns: pronoun,
                          possessivePronouns: possessivePronoun,
                          generatedAt: new Date().toISOString(),
                        },
                      ];
                    case 9:
                      error_8 = _f.sent();
                      logger_1.logger.error(
                        'Error generating story with Gemini API',
                        (0, error_handlers_1.serializeError)(error_8)
                      );
                      throw error_8;
                    case 10:
                      return [2 /*return*/];
                  }
                });
              });
            };
            fallbackFunction = function () {
              logger_1.logger.warn('Using fallback story generation due to API failure', {
                circuitState: error_handlers_1.geminiCircuitBreaker.status.stats,
                metrics: error_handlers_1.geminiCircuitBreaker.stats,
              });
              var fallbackContent = (0, fallback_generator_1.generateFallbackStory)(input);
              // Parse the fallback story
              var titleMatch = fallbackContent.match(/^#\s*(.+?)(?:\n|$)/m);
              var title = titleMatch
                ? titleMatch[1].trim()
                : ''.concat(
                    input.theme.charAt(0).toUpperCase() + input.theme.slice(1),
                    ' Adventure'
                  );
              var content = titleMatch
                ? fallbackContent.replace(/^#\s*(.+?)(?:\n|$)/m, '').trim()
                : fallbackContent;
              return {
                id: storyId,
                title: title,
                content: content,
                theme: input.theme,
                createdAt: new Date().toISOString(),
                input: input,
                metadata: {
                  pronouns: pronoun,
                  possessivePronouns: possessivePronoun,
                  generatedAt: new Date().toISOString(),
                  wordCount: content.split(/\s+/).length,
                  readingTime: Math.ceil(content.split(/\s+/).length / 200),
                  fallback: true,
                },
                userId: _this.userId,
                pronouns: pronoun,
                possessivePronouns: possessivePronoun,
                generatedAt: new Date().toISOString(),
              };
            };
            _b.label = 3;
          case 3:
            _b.trys.push([3, 5, , 6]);
            return [4 /*yield*/, error_handlers_1.geminiCircuitBreaker.fire(apiCallFunction)];
          case 4:
            // Use the Opossum circuit breaker to make the API call
            return [2 /*return*/, _b.sent()];
          case 5:
            error_6 = _b.sent();
            // This catch block handles any errors that might occur in the circuit breaker itself
            logger_1.logger.error(
              'Circuit breaker caught error',
              (0, error_handlers_1.serializeError)(error_6)
            );
            return [2 /*return*/, fallbackFunction()];
          case 6:
            return [3 /*break*/, 8];
          case 7:
            error_7 = _b.sent();
            // This catch block handles any errors in the overall story generation process
            logger_1.logger.error(
              'Error in generatePersonalizedStory',
              (0, error_handlers_1.serializeError)(error_7)
            );
            fallbackContent = (0, fallback_generator_1.generateFallbackStory)(input);
            return [
              2 /*return*/,
              {
                id: storyId,
                title: ''.concat(
                  input.theme.charAt(0).toUpperCase() + input.theme.slice(1),
                  ' Adventure'
                ),
                content: fallbackContent,
                theme: input.theme,
                createdAt: new Date().toISOString(),
                input: input,
                metadata: {
                  pronouns: pronoun,
                  possessivePronouns: possessivePronoun,
                  generatedAt: new Date().toISOString(),
                  wordCount: fallbackContent.split(/\s+/).length,
                  readingTime: Math.ceil(fallbackContent.split(/\s+/).length / 200),
                  fallback: true,
                  error: error_7.message,
                },
                userId: this.userId,
                pronouns: pronoun,
                possessivePronouns: possessivePronoun,
                generatedAt: new Date().toISOString(),
              },
            ];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Call the Gemini API endpoint to generate a story
   *
   * This method makes a request to the Gemini API endpoint with the story input parameters.
   * It includes error handling and detailed logging.
   *
   * @param input Story generation input parameters
   * @returns Generated story content
   */
  UserPersonalizationEngine.prototype.callGeminiEndpoint = function (input) {
    return __awaiter(this, void 0, void 0, function () {
      var prefs,
        pronouns,
        themeDescription,
        themeElements,
        prompt_2,
        response,
        errorData,
        data,
        error_9;
      var _a, _b, _c, _d, _e;
      return __generator(this, function (_f) {
        switch (_f.label) {
          case 0:
            _f.trys.push([0, 6, , 7]);
            logger_1.logger.info('Calling Gemini API endpoint for story generation', {
              childName: input.childName,
              theme: input.theme,
              gender: input.gender,
              interestsCount:
                ((_a = input.interests) === null || _a === void 0 ? void 0 : _a.length) || 0,
            });
            return [4 /*yield*/, this.getUserPreferences()];
          case 1:
            prefs = _f.sent();
            pronouns =
              input.gender === 'female' || input.gender === 'girl'
                ? 'she/her'
                : input.gender === 'boy' || input.gender === 'male'
                  ? 'he/him'
                  : 'they/them';
            themeDescription = exports.THEME_DESCRIPTIONS[input.theme] || input.theme;
            themeElements = exports.THEME_ELEMENTS[input.theme];
            prompt_2 = '\n        Create a bedtime story for a child named '
              .concat(input.childName, ' who uses ')
              .concat(pronouns, ' pronouns.\n\n        The story should be about ')
              .concat(themeDescription, '.\n\n        ')
              .concat(
                ((_b = input.interests) === null || _b === void 0 ? void 0 : _b.length)
                  ? 'Include these interests: '.concat(input.interests.join(', '), '.')
                  : '',
                '\n        '
              )
              .concat(
                ((_c = prefs.learningInterests) === null || _c === void 0 ? void 0 : _c.length)
                  ? 'The child is also interested in learning about: '.concat(
                      prefs.learningInterests.join(', '),
                      '.'
                    )
                  : '',
                '\n\n        '
              )
              .concat(
                themeElements
                  ? '\n        You can use these settings: '
                      .concat(
                        themeElements.settings.join(', '),
                        '.\n        You can include these character types: '
                      )
                      .concat(
                        themeElements.characters.join(', '),
                        '.\n        You can incorporate these challenges: '
                      )
                      .concat(themeElements.challenges.join(', '), '.\n        ')
                  : '',
                '\n        \n        '
              )
              .concat(
                ((_d = input.favoriteCharacters) === null || _d === void 0 ? void 0 : _d.length)
                  ? 'Try to include references to these favorite characters: '.concat(
                      input.favoriteCharacters.join(', '),
                      '.'
                    )
                  : '',
                '\n        '
              )
              .concat(
                (
                  (_e = input.mostLikedCharacterTypes) === null || _e === void 0
                    ? void 0
                    : _e.length
                )
                  ? 'The child enjoys characters that are: '.concat(
                      input.mostLikedCharacterTypes.join(', '),
                      '.'
                    )
                  : '',
                '\n        \n        Make the story age-appropriate for a '
              )
              .concat(
                prefs.ageGroup || '6-8',
                ' year old child.\n        The story should be engaging, with a positive message.\n\n        Format the story with a title at the beginning using a single # markdown heading.\n        Keep the story under 500 words.\n      '
              );
            return [
              4 /*yield*/,
              fetch('/api/gemini', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  type: 'story',
                  childName: input.childName,
                  gender: input.gender,
                  theme: input.theme,
                  interests: input.interests,
                  prompt: prompt_2,
                }),
              }),
            ];
          case 2:
            response = _f.sent();
            if (!!response.ok) return [3 /*break*/, 4];
            return [4 /*yield*/, response.json()];
          case 3:
            errorData = _f.sent();
            throw new Error('Gemini API error: '.concat(errorData.error || response.statusText));
          case 4:
            return [4 /*yield*/, response.json()];
          case 5:
            data = _f.sent();
            logger_1.logger.info('Successfully received story from Gemini API', {
              contentLength: data.content.length,
              model: data.model,
            });
            return [2 /*return*/, data.content];
          case 6:
            error_9 = _f.sent();
            logger_1.logger.error(
              'Error calling Gemini API endpoint',
              (0, error_handlers_1.serializeError)(error_9)
            );
            throw error_9;
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  /**
   * Store generated story in user history
   *
   * This method saves a generated story to the user's history in the database.
   * It includes error handling and detailed logging.
   *
   * @param story Story object to save
   * @returns Whether the operation was successful
   */
  UserPersonalizationEngine.prototype.saveStoryToHistory = function (story) {
    return __awaiter(this, void 0, void 0, function () {
      var historyEntry, userData, currentHistory, updatedHistory, error_10;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.userId || this.userId === 'default-user') return [2 /*return*/, false];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 4, , 5]);
            historyEntry = {
              id: story.id,
              title: story.title,
              theme: story.theme,
              childName: story.input.childName,
              createdAt: story.createdAt,
              wordCount: story.metadata.wordCount || 0,
              fallback: story.metadata.fallback || false,
            };
            return [4 /*yield*/, redis.hgetall('user:'.concat(this.userId))];
          case 2:
            userData = _a.sent();
            if (!userData) {
              logger_1.logger.warn('No user data found when saving story to history', {
                userId: this.userId,
              });
              return [2 /*return*/, false];
            }
            currentHistory = JSON.parse(userData.storyHistory || '[]');
            updatedHistory = __spreadArray([historyEntry], currentHistory, true).slice(0, 20);
            // Update history in database
            return [
              4 /*yield*/,
              redis.hset('user:'.concat(this.userId), {
                storyHistory: JSON.stringify(updatedHistory),
                lastStoryGeneratedAt: new Date().toISOString(),
              }),
            ];
          case 3:
            // Update history in database
            _a.sent();
            logger_1.logger.info('Successfully saved story to history', {
              userId: this.userId,
              storyId: story.id,
              historyLength: updatedHistory.length,
            });
            return [2 /*return*/, true];
          case 4:
            error_10 = _a.sent();
            logger_1.logger.error(
              'Error saving story to history',
              (0, error_handlers_1.serializeError)(error_10)
            );
            return [2 /*return*/, false];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  };
  // Get user's story history
  UserPersonalizationEngine.prototype.getStoryHistory = function () {
    return __awaiter(this, void 0, void 0, function () {
      var kvKey, stories, kvError_3, storageKey, storiesJson, error_11;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.userId || this.userId === 'default-user') return [2 /*return*/, []];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 6, , 7]);
            if (!this.isServerSide) return [3 /*break*/, 5];
            _a.label = 2;
          case 2:
            _a.trys.push([2, 4, , 5]);
            kvKey = 'user:stories:'.concat(this.userId);
            return [4 /*yield*/, redis.get(kvKey)];
          case 3:
            stories = _a.sent();
            return [2 /*return*/, stories || []];
          case 4:
            kvError_3 = _a.sent();
            logger_1.logger.error('Error fetching story history from Redis:', { error: kvError_3 });
            return [3 /*break*/, 5];
          case 5:
            // Client-side storage fallback
            if (typeof window !== 'undefined') {
              storageKey = 'stories:'.concat(this.userId);
              storiesJson = localStorage.getItem(storageKey);
              return [2 /*return*/, storiesJson ? JSON.parse(storiesJson) : []];
            }
            return [2 /*return*/, []];
          case 6:
            error_11 = _a.sent();
            logger_1.logger.error('Error fetching story history:', { error: error_11 });
            return [2 /*return*/, []];
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  // Helper method to generate a random character
  UserPersonalizationEngine.prototype.generateRandomCharacter = function (type) {
    if (type === void 0) {
      type = 'animal';
    }
    var personality =
      exports.CHARACTER_TRAITS.personality[
        Math.floor(Math.random() * exports.CHARACTER_TRAITS.personality.length)
      ];
    var archetype =
      exports.CHARACTER_ARCHETYPES[Math.floor(Math.random() * exports.CHARACTER_ARCHETYPES.length)];
    return {
      name: '', // Empty name to be filled by the user
      type: type,
      traits: [personality],
      role: archetype,
      description: 'A '.concat(personality, ' ').concat(type, ' who is a ').concat(archetype),
    };
  };
  // Helper method to suggest character traits based on theme
  UserPersonalizationEngine.prototype.suggestCharacterTraits = function (theme) {
    var themeBasedTraits = {
      adventure: ['brave', 'curious', 'adventurous', 'determined'],
      fantasy: ['imaginative', 'curious', 'creative', 'brave'],
      science: ['curious', 'clever', 'analytical', 'inventive'],
      nature: ['gentle', 'observant', 'caring', 'patient'],
      friendship: ['kind', 'loyal', 'helpful', 'understanding'],
      educational: ['curious', 'attentive', 'thoughtful', 'clever'],
      courage: ['brave', 'determined', 'resilient', 'confident'],
      kindness: ['kind', 'generous', 'empathetic', 'thoughtful'],
      curiosity: ['curious', 'inquisitive', 'observant', 'thoughtful'],
      creativity: ['creative', 'imaginative', 'artistic', 'innovative'],
    };
    // Return 2 random traits from the theme-based list
    var traits = themeBasedTraits[theme] || themeBasedTraits.adventure;
    var selectedTraits = [];
    // Select 2 unique traits
    while (selectedTraits.length < 2 && traits.length > 0) {
      var randomIndex = Math.floor(Math.random() * traits.length);
      selectedTraits.push(traits[randomIndex]);
      traits.splice(randomIndex, 1); // Remove the selected trait to avoid duplicates
    }
    return selectedTraits;
  };
  return UserPersonalizationEngine;
})();
exports.UserPersonalizationEngine = UserPersonalizationEngine;
// Singleton instance of the personalization engine
exports.userPersonalizationEngine = new UserPersonalizationEngine('default-user');
__exportStar(require('../types/story'), exports);

// Helper function to make server-side Redis calls
async function serverRedisCall(operation, params) {
  if (typeof window === 'undefined') {
    // Server-side: use direct Redis client
    const serverRedis = require('../utils/redis.server');
    return serverRedis[operation](...params);
  }

  // Client-side: use API route
  try {
    const response = await fetch('/api/redis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation,
        ...params,
      }),
    });

    if (!response.ok) {
      throw new Error('Redis operation failed');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Redis operation error:', error);
    // Fallback to client-side implementation
    return redis[operation](...params);
  }
}
