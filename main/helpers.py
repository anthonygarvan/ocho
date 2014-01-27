from json import JSONEncoder, JSONDecoder
from django.db.models.query import QuerySet
import simplejson
import json
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder

def jsonify(object):
    if isinstance(object, QuerySet):
        result = []
        for o in object:
            result.append(o)
        return json.dumps(result, cls=DjangoJSONEncoder)
    return json.dumps(object, cls=DjangoJSONEncoder)
